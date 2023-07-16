import {
    Button,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    Table,
    TabPane,
} from "reactstrap";
import {useEffect, useState} from "react";
import {AiOutlineDownload} from "react-icons/ai";
import {GiConfirmed} from "react-icons/gi";
import {getLinkFromDoc} from "@/core/utils/get-link-from-doc";
import {getContract} from "@/core/utils/connect-contract";
import {TbBan} from "react-icons/tb";

export default function ModalViewDocument(props) {
    const {isOpen, toggle, user, currentDoc} = props;
    const [currentTab, setCurrentTab] = useState(1);

    const [userRequests, setUserRequests] = useState([]);
    const [usersAccess, setUsersAccess] = useState([]);
    const contract = getContract();

    useEffect(() => {
        if (currentTab == 1) {
            getUserRequests();
        }
        if (currentTab == 2) {
            getUsersAccess();
        }
    }, [currentTab])

    const getUserRequests = async () => {
        if (currentDoc) {
            const data = await contract.getAllRequestedFiles(currentDoc.clusterId, currentDoc.id);
            console.log(data);
            setUserRequests(data);
        }
    }

    const getUsersAccess = async () => {
        if (currentDoc) {   
            const data = await contract.getAllUserAccessFile(currentDoc.clusterId, currentDoc.id);
            setUsersAccess(data);
        }
    }

    const grantAccessFile = async (userAddress) => {
        if (currentDoc) {
            const data = await contract.grantAccess(currentDoc.clusterId, currentDoc.id, userAddress);
        }
    }

    const removeAccessFile = async (userAddress) => {
        if (currentDoc) {
            const data = await contract.removeAccess(currentDoc.clusterId, currentDoc.id, userAddress);
        }
    }
    return (
        <>
            <Modal isOpen={isOpen} toggle={toggle} size={"lg"}>
                <ModalHeader toggle={toggle}>Tài liệu</ModalHeader>
                <ModalBody>
                    <Form className="w-100">
                        <FormGroup>
                            <Label tag="h6">Thông tin tài liệu</Label>
                            <Row>
                                <Col md={11}>
                                    {currentDoc && <Input
                                        name="name"
                                        placeholder="Tên tài liệu"
                                        type="text"
                                        value={currentDoc.name}
                                        disabled
                                    />}
                                </Col>
                                <Col md={1}>
                                    <a className={'btn btn-primary'}
                                       href={currentDoc ? getLinkFromDoc(currentDoc) : ''} target={"_blank"}>
                                        <AiOutlineDownload/>
                                    </a>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Form>
                    <div>
                        <Nav tabs>
                            <NavItem className={'cursor-pointer'}>
                                <NavLink
                                    className={currentTab == 1 ? 'active' : ''}
                                    onClick={() => setCurrentTab(1)}
                                >
                                    Yêu cầu truy cập
                                </NavLink>
                            </NavItem>
                            <NavItem className={'cursor-pointer'}>
                                <NavLink
                                    className={currentTab == 2 ? 'active' : ''}
                                    onClick={() => setCurrentTab(2)}
                                >
                                    Được phép truy cập
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={`${currentTab}`} className="pt-2">
                            <TabPane tabId={"1"}>
                                <Table
                                    bordered
                                    responsive
                                    striped
                                >
                                    <thead>
                                    <tr>
                                        <th> #</th>
                                        <th>Tên</th>
                                        <th width={'20%'}/>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        userRequests.map((user, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th scope="row">
                                                        {index}
                                                    </th>

                                                    <td>
                                                        {user.name}
                                                    </td>
                                                    <td>
                                                        <Button className={"mr-2"} color={'primary'}
                                                                onClick={() => grantAccessFile(user.addressUser)}>
                                                            <GiConfirmed/>
                                                        </Button>
                                                        <Button className={"mr-2"}
                                                                color={'danger'}
                                                                onClick={() => removeAccessFile(user.addressUser)}>
                                                            <TbBan/>
                                                        </Button>


                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }


                                    </tbody>
                                </Table>
                            </TabPane>
                            <TabPane tabId="2">
                                <Table
                                    bordered
                                    responsive
                                    striped
                                >
                                    <thead>
                                    <tr>
                                        <th> #</th>
                                        <th>Tên</th>
                                        <th width={'10%'}/>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        usersAccess.map((user, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th scope="row">
                                                        {index}
                                                    </th>

                                                    <td>
                                                        {user.name}
                                                    </td>
                                                    <td>
                                                        <Button className={"mr-2"} color={'danger'}
                                                                onClick={() => removeAccessFile(user.addressUser)}>
                                                            <TbBan/></Button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }


                                    </tbody>
                                </Table>
                            </TabPane>
                        </TabContent>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

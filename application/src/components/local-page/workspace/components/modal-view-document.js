import {
    Button,
    Card,
    CardText,
    CardTitle,
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
import {useState} from "react";
import {AiOutlineDownload} from "react-icons/ai";
import {GiConfirmed} from "react-icons/gi";
import {TbBan} from "react-icons/tb";
import {getLinkFromDoc} from "@/core/utils/get-link-from-doc";

export default function ModalViewDocument(props) {
    const {isOpen, toggle, user, currentDoc} = props;
    const [currentTab, setCurrentTab] = useState(1);
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
                                       href={currentDoc ? getLinkFromDoc(currentDoc) : ''}>
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
                                    Danh sách yêu cầu truy cập
                                </NavLink>
                            </NavItem>
                            <NavItem className={'cursor-pointer'}>
                                <NavLink
                                    className={currentTab == 2 ? 'active' : ''}
                                    onClick={() => setCurrentTab(2)}
                                >
                                    More Tabs
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
                                        <th>Định danh</th>
                                        <th>Tên</th>
                                        <th width={'15%'}></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <th scope="row">
                                            1
                                        </th>
                                        <td>
                                            Mark
                                        </td>
                                        <td>
                                            Otto
                                        </td>
                                        <td>
                                            <Button className={"mr-2"} color={'primary'}> <GiConfirmed color={"green"}/></Button>
                                            <Button color={'danger'}> <TbBan color={"red"}/></Button>
                                        </td>
                                    </tr>

                                    </tbody>
                                </Table>
                            </TabPane>
                            <TabPane tabId="2">
                                <Row>
                                    <Col sm="6">
                                        <Card body>
                                            <CardTitle>
                                                Special Title Treatment
                                            </CardTitle>
                                            <CardText>
                                                With supporting text below as a
                                                natural lead-in to additional
                                                content.
                                            </CardText>
                                            <Button>Go somewhere</Button>
                                        </Card>
                                    </Col>
                                    <Col sm="6">
                                        <Card body>
                                            <CardTitle>
                                                Special Title Treatment
                                            </CardTitle>
                                            <CardText>
                                                With supporting text below as a
                                                natural lead-in to additional
                                                content.
                                            </CardText>
                                            <Button>Go somewhere</Button>
                                        </Card>
                                    </Col>
                                </Row>
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

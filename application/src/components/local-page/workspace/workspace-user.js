import {Button, Nav, NavItem, NavLink, TabContent, Table, TabPane} from "reactstrap";
import {useEffect, useState} from "react";
import ModalAddDocument from "./components/modal-add-document";
import ModalViewDocument from "./components/modal-view-document";
import {TbBan} from 'react-icons/tb'
import {GiConfirmed} from 'react-icons/gi'
import {AiFillEye, AiOutlineDownload} from 'react-icons/ai'
import {getContract} from "@/core/utils/connect-contract";
import {BiTimer} from "react-icons/bi";
import {getLinkFromDoc} from "@/core/utils/get-link-from-doc";

export default function WorkspaceUser({user}) {

    const [modalAddDoc, setModalAddDoc] = useState(false);
    const [modalViewDoc, setModalViewDoc] = useState(false);
    const [currentDoc, setCurrentDoc] = useState();
    const [documents, setDocuments] = useState([]);
    const [documentsAccess, setDocumentsAccess] = useState([]);
    const [currentTab, setCurrentTab] = useState(1);
    const toggleAddDoc = () => setModalAddDoc(!modalAddDoc);
    const toggleViewDoc = () => setModalViewDoc(!modalViewDoc);
    const contract = getContract();

    useEffect(() => {
        contract.on('FileUploaded', (eventArgs) => {
            if (eventArgs === user.address) {
                getDocuments();
            }
        });
        contract.on('AcceptFileCluster', (eventArgs) => {
            if (eventArgs === user.address) {
                getDocuments();
            }
        });
        contract.on('RejectFileCluster', (eventArgs) => {
            if (eventArgs === user.address) {
                getDocuments();
            }
        });
        getDocuments();
    }, [user]);
    const getDocuments = async () => {
        const result = await contract.getFilesByMe();
        setDocuments(result)
    };

    const getFileAccess = async () => {
        const result = await contract.getFilesGrantedAccess(user.address);
        setDocumentsAccess(result)
    };

    useEffect(() => {
        if (currentTab == 1) {
            getDocuments();
        }
        if (currentTab == 2) {
            getFileAccess();
        }
    }, [currentTab])


    return (
        <>
            <div className="workspace-container">
                <h3 className={'text-center'}> Quản lý tài liệu</h3>

                <div className="btn-control-container">
                    <Button color="danger" onClick={toggleAddDoc}>
                        Thêm tài liệu +
                    </Button>

                </div>
                <Nav tabs>
                    <NavItem className={'cursor-pointer'}>
                        <NavLink
                            className={currentTab == 1 ? 'active' : ''}
                            onClick={() => setCurrentTab(1)}
                        >
                            Của tôi
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
                        <Table bordered striped>
                            <thead>
                            <tr>
                                <th style={{width: "10%"}}>#</th>
                                <th style={{width: "55%"}}>Tên tài liệu</th>
                                <th style={{width: "20%"}}>Ngày tạo</th>
                                <th style={{width: "5%"}}>Duyệt</th>
                                <th style={{width: "10%"}}/>
                            </tr>
                            </thead>
                            <tbody>
                            {documents.map((doc, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{index}</th>
                                        <td>{doc.name}</td>
                                        <td>{doc.createdAt}</td>
                                        <td className="text-center">
                                            {doc.isAvailable == 0 && <BiTimer size={30}/>}
                                            {doc.isAvailable == 1 && <GiConfirmed color={"green"}/>}
                                            {doc.isAvailable == 2 && <TbBan color={"red"}/>}
                                        </td>
                                        <td><Button onClick={() => {
                                            setCurrentDoc(doc)
                                            toggleViewDoc()
                                        }}><AiFillEye size={20}/></Button></td>
                                    </tr>
                                )
                            })}

                            </tbody>
                        </Table>
                    </TabPane>
                    <TabPane tabId={"2"}>
                        <Table bordered striped>
                            <thead>
                            <tr>
                                <th style={{width: "10%"}}>#</th>
                                <th style={{width: "55%"}}>Tên tài liệu</th>
                                <th style={{width: "20%"}}>Ngày tạo</th>
                                <th style={{width: "20%"}}>Tác giả</th>
                                <th style={{width: "10%"}}/>
                            </tr>
                            </thead>
                            <tbody>
                            {documentsAccess.map((doc, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{index}</th>
                                        <td>{doc.name}</td>
                                        <td>{doc.createdAt}</td>
                                        <td>{doc.authorName}</td>
                                        <td><a className={'btn btn-primary'}
                                               href={getLinkFromDoc(doc)} target={"_blank"}>
                                            <AiOutlineDownload/>
                                        </a></td>
                                    </tr>
                                )
                            })}

                            </tbody>
                        </Table>
                    </TabPane>
                </TabContent>



            </div>
            <ModalViewDocument isOpen={modalViewDoc} toggle={toggleViewDoc} user={user}
                               currentDoc={currentDoc}/>
            <ModalAddDocument isOpen={modalAddDoc} toggle={toggleAddDoc} user={user}/>
        </>
    );
}

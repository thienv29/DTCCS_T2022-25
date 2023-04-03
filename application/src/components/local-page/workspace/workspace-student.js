import {Button, Table} from "reactstrap";
import {useEffect, useState} from "react";
import ModalAddDocument from "./components/modal-add-document";
import ModalViewDocument from "./components/modal-view-document";
import {TbBan} from 'react-icons/tb'
import {GiConfirmed} from 'react-icons/gi'
import {AiFillEye} from 'react-icons/ai'
import {getContract} from "@/core/utils/connect-contract";
import {BiTimer} from "react-icons/bi";

export default function WorkspaceStudent({user}) {

    const [modalAddDoc, setModalAddDoc] = useState(false);
    const [modalViewDoc, setModalViewDoc] = useState(false);
    const [currentDoc, setCurrentDoc] = useState();
    const [documents, setDocuments] = useState([]);
    const toggleAddDoc = () => setModalAddDoc(!modalAddDoc);
    const toggleViewDoc = () => setModalViewDoc(!modalViewDoc);
    const contract = getContract();

    useEffect(() => {
        contract.on('FileUploaded', (eventArgs, s) => {
            if (eventArgs === user.address){
                getDocuments();
            }
        });
        contract.on('AcceptFileCluster', (eventArgs) => {
            if (eventArgs === user.address){
                getDocuments();
            }
        });
        contract.on('RejectFileCluster', (eventArgs) => {
            if (eventArgs === user.address){
                getDocuments();
            }
        });
        getDocuments();
    }, [user]);
    const getDocuments = async () => {
        const result = await contract.getFilesByMe();
        setDocuments(result)
    };

    return (
        <>
            <div className="workspace-container">
                <h3 className={'text-center'}> Quản lý tài liệu (Học sinh) </h3>

                <div className="btn-control-container">
                    <Button color="danger" onClick={toggleAddDoc}>
                        Thêm tài liệu +
                    </Button>

                </div>

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
                                    {doc.isAvailable == 0 && <BiTimer/>}
                                    {doc.isAvailable == 1 && <GiConfirmed color={"green"}/> }
                                    {doc.isAvailable == 2 &&  <TbBan color={"red"}/>}
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

            </div>
            <ModalViewDocument isOpen={modalViewDoc} toggle={toggleViewDoc} user={user}
                               currentDoc={currentDoc}/>
            <ModalAddDocument isOpen={modalAddDoc} toggle={toggleAddDoc} user={user} />
        </>
    );
}

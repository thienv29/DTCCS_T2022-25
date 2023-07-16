import {Button, Table} from "reactstrap";
import {BsFileDiff} from "react-icons/bs";
import {getContract} from "@/core/utils/connect-contract";
import {useEffect, useState} from "react";
import {getLinkFromDoc} from "@/core/utils/get-link-from-doc";
import {AiOutlineDownload} from "react-icons/ai";
import {ethers} from "ethers";
export default function SearchResult({documents}) {
    const [contract, setContract] = useState();
    useEffect(() => {
        setContract(getContract());
    }, [])
    const requestAccessFile = (doc) => {
        console.log(documents)
        console.log(ethers.BigNumber.from(doc.id))
        contract.requestAccess(doc.clusterId, doc.id);
    }
    return <>
        <Table bordered striped className={'mt-2'}>
            <thead>
            <tr>
                <th style={{width: "5%"}}>#</th>
                <th style={{width: "50%"}}>Tên tài liệu</th>
                <th style={{width: "20%"}}>Tên tác giả</th>
                <th style={{width: "20%"}}>Ngày tạo</th>
                <th style={{width: "5%"}}/>
            </tr>
            </thead>
            <tbody>
            {documents.map((doc, index) => {
                return (
                    <tr key={index}>
                        <th scope="row">{index}</th>
                        <td>{doc.name}</td>
                        <td>{doc.authorName}</td>

                        <td>{doc.createdAt}</td>
                        <td>
                            <div className={'d-flex'}>
                                {
                                    doc.ipfsHash == "" ?
                                        <Button className={'mr-2'} color={'primary'}
                                                onClick={() => requestAccessFile(doc)}><BsFileDiff size={20}/></Button>
                                        :
                                        <a className={'btn btn-primary'}
                                           href={getLinkFromDoc(doc)} target={"_blank"}>
                                            <AiOutlineDownload/>
                                        </a>


                                }

                            </div>

                        </td>
                    </tr>
                )
            })}

            </tbody>
        </Table>
    </>
}
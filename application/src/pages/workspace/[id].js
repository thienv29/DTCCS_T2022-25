import {Button, Row, Table} from "reactstrap";
import {GiConfirmed} from "react-icons/gi";
import {TbBan} from "react-icons/tb";
import {useEffect, useState} from "react";
import {getLinkFromDoc} from "@/core/utils/get-link-from-doc";
import {AiOutlineDownload} from "react-icons/ai";
import {getContract} from "@/core/utils/connect-contract";
import axios from "axios";
import {useRouter} from "next/router";
import {getSession} from "next-auth/react";
import {BiTimer} from "react-icons/bi";

export default function cluster({clusterId, user}) {
    const [documents, setDocuments] = useState([]);
    const [clusterCur, setClusterCur] = useState();
    const [users, setUsers] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const contract = getContract();
        getClusterById(contract);
        contract.on('FileUploaded', (eventArgs) => {
            getDocuments(contract);
        });
        contract.on('AcceptFileCluster', (eventArgs) => {
            if (eventArgs === user.address){
                getDocuments(contract);
            }
        });
        contract.on('RejectFileCluster', (eventArgs) => {
            if (eventArgs === user.address){
                getDocuments(contract);
            }
        });
        getDocuments(contract);

    }, []);
    const getDocuments = async (contract) => {
        const data = await contract.getFilesByCluster(clusterId)
        const resUser = await axios.post('/api/user/get-user-by-addresses', {addresses: data.map(e => e.author)})
        setUsers(resUser.data);
        setDocuments(data)
    };
    const getClusterById = async (contract) => {
        const data = await contract.getClusterById(clusterId)
        if (data.name == '') {
            router.push('/workspace');
        };
        setClusterCur(data);
    };
    
    const acceptFile = async (fileId) => {
        const contract = getContract();
        await contract.acceptFile(clusterId, fileId);
    }
    
    const rejectFile = async (fileId) => {
        const contract = getContract();
        await contract.rejectFile(clusterId, fileId);
    }
    return (
        <div className="flex-center flex-col ">
            <div className={'workspace-container'}>
                <Row>
                    <h3 className={'text-center mb-30'}> Kiểm duyệt tài liệu Cluster: {clusterCur?.name}</h3>
                </Row>

                <Table bordered striped>
                    <thead>
                    <tr>
                        <th style={{width: "5%"}}>#</th>
                        <th style={{width: "50%"}}>Tên tài liệu</th>
                        <th style={{width: "20%"}}>Tên tác giả</th>
                        <th style={{width: "5%"}}>Duyệt</th>
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
                                <td>{users.find(u => u.address == doc.author).name}</td>
                                <td className="text-center">
                                    {doc.isAvailable == 0 && <BiTimer/>}
                                    {doc.isAvailable == 1 && <GiConfirmed color={"green"}/> }
                                    {doc.isAvailable == 2 &&  <TbBan color={"red"}/>}
                                </td>
                                <td>{doc.createdAt}</td>
                                <td>
                                    <div className={'d-flex'}>
                                        <Button className={'mr-2'} color={'primary'} onClick={() => acceptFile(doc.id)}><GiConfirmed size={20}/></Button>
                                        <Button color={'danger'} className={'mr-2'} onClick={() => rejectFile(doc.id)}><TbBan size={20}/></Button>
                                        <a className={'btn btn-secondary'}
                                           href={doc ? getLinkFromDoc(doc) : ''}>
                                            <AiOutlineDownload/>
                                        </a>
                                    </div>

                                </td>
                            </tr>
                        )
                    })}

                    </tbody>
                </Table>
            </div>


        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    // redirect if not authenticated
    if (!session) {
        return {
            redirect: {
                destination: "/signin",
                permanent: false,
            },
        };
    }

    return {
        props: {
            clusterId: context.query.id,
            user: session.user
        }
    }
}
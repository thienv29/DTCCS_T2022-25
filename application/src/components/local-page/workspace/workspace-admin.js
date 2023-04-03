import {useEffect, useState} from "react";
import {Col, Row} from "reactstrap";
import ModalAddCluster from "@/components/local-page/workspace/components/modal-add-cluster";
import {useRouter} from "next/router";
import {getContract} from '@/core/utils/connect-contract';

export default function WorkspaceAdmin({user}) {
    const [clusters, setClusters] = useState([]);
    const [isOpenAddCluster, setIsOpenAddCluster] = useState(false);
    const toggleAddCluster = () => setIsOpenAddCluster(!isOpenAddCluster);
    const router = useRouter();
    const contract = getContract();
    useEffect(() => {
        contract.on('CreateCluster', (eventArgs) => {
            getCluster();
        })
        getCluster();
    }, [])

    const getCluster = async () => {
        const clusterCreated = await contract.getClusters()
        setClusters(clusterCreated)
    }
    const handleClickCluster = (idCluster) => {
        router.push('/workspace/' + idCluster)
    }

    return <>
        <div className={'workspace-container'}>

            <div className={'header-cluster'}>
                <h3 className={'text-center'}>Clusters</h3>
            </div>
            <div>
                <Row>
                    {clusters.map((e) =>
                        <Col md={4} key={e.id}>
                            <div className={'card-cluster mt-4 cursor-pointer'}
                                 onClick={() => handleClickCluster(e.id)}
                            >
                                {e.name}
                            </div>

                        </Col>
                    )}
                    <Col md={4}>
                        <div className={'card-cluster-plus mt-4 cursor-pointer '} onClick={toggleAddCluster}>+</div>
                    </Col>
                </Row>


            </div>
        </div>
        <ModalAddCluster isOpen={isOpenAddCluster} toggle={toggleAddCluster} user={user} refreshClusters={getCluster}/>


    </>
}
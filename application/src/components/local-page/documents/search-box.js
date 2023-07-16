import {getContract} from "@/core/utils/connect-contract";
import {useEffect, useState} from "react";
import {Button, Col, Form, Input, Row} from "reactstrap";
import {BsSearch} from "react-icons/bs";

export default function SearchBox({onSearch}) {
    const [clusters, setClusters] = useState([]);
    const [clusterSelected, setClusterSelected] = useState();

    useEffect(() => {
        const contract = getContract();
        contract.on('CreateCluster', (eventArgs) => {
            getCluster(contract);
        })
        getCluster(contract);
    }, [])

    const getCluster = async (contract) => {
        setClusters(await contract.getClusters());
    }

    return <>
        <Form>
            <Row>
                <Col sm={9}>
                    <input className="form-control me-sm-2" type="search" placeholder="Search"
                           onChange={(e) => onSearch(e.target.value)}/>
                </Col>
                <Col sm={2}>
                    <Input
                        require
                        name="role"
                        type="select"
                        className={'me-sm-2'}
                        value={clusterSelected}
                        onChange={(e) => setClusterSelected(e.target.value)}
                    >
                        <option value={null}>Tất cả cụm</option>
                        {clusters.map((clus, index) =>
                            <option key={index} value={clus.id}>{clus.name}</option>
                        )}
                    </Input>
                </Col>
                <Col sm={1}>
                    <Button color={'secondary'}><BsSearch size={20}/></Button>

                </Col>
            </Row>


        </Form>
    </>
}
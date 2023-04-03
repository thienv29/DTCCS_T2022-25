import {Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader,} from "reactstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {getContract} from "@/core/utils/connect-contract";

export default function ModalAddDocument(props) {
    const {isOpen, toggle, user} = props;
    const [fileSelected, setFileSelected] = useState();
    const [documentName, setDocumentName] = useState();
    const [documentDes, setDocumentDes] = useState();
    const [clusterSelected, setClusterSelected] = useState();
    const [clusters, setClusters] = useState([]);
    const [isCreating, setIsCreating] = useState(false);

    const contract = getContract();
    useEffect(() => {
        contract.on('CreateCluster', (eventArgs) => {
            getCluster();
        })
        getCluster();
    }, [])

    const getCluster = async () => {
        setClusters(await contract.getClusters());
    }

    const handleInputFile = (e) => {
        setFileSelected(e.target.files[0]);
    };

    const getNow = () => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const formattedDate = dd + '-' + mm + '-' + yyyy;
        return formattedDate;
    }


    const handleUpload = async () => {
        if (!fileSelected) return;
        setIsCreating(true);
        try {
            const formData = new FormData();
            formData.append("myFile", fileSelected);
            const {data} = await axios.post("/api/document/file/upload", formData);
            await contract.createFile(documentName, documentDes, data[0].path, getNow(), clusterSelected);
        }catch (e) {
            console.log(e)
        }
        setIsCreating(false)
        toggle();

    }
    return (
        <>
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>Thêm tài liệu</ModalHeader>
                <ModalBody>

                    <Form className="w-100">

                        <FormGroup>
                            <Label tag="h6">Tên tài liệu</Label>
                            <Input
                                name="name"
                                placeholder="Tên tài liệu"
                                type="text"
                                value={documentName}
                                onChange={(event) => setDocumentName(event.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label tag="h6">Tên tài liệu</Label>
                            <Input
                                name="name"
                                placeholder="Mô tả"
                                type="textarea"
                                value={documentDes}
                                onChange={(event) => setDocumentDes(event.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label tag="h6">Tệp</Label>
                            <Input
                                type="file"
                                id="upload-file"
                                className="mr-2"
                                onChange={handleInputFile}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label tag="h6">Cụm</Label>
                            <Input
                                name="role"
                                type="select"
                                value={clusterSelected}
                                onChange={(e) => setClusterSelected(e.target.value)}
                            >
                                <option value={null}>Chưa chọn</option>
                                {clusters.map((clus) =>
                                    <option value={clus.id}>{clus.name}</option>
                                )}
                            </Input>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={handleUpload}
                        disabled={isCreating}
                    >
                        Tải lên
                    </Button>{" "}
                    <Button color="secondary" onClick={toggle}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

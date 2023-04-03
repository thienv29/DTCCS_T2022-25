import {Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader,} from "reactstrap";
import {useState} from "react";
import {getContract} from "@/core/utils/connect-contract";

export default function ModalAddCluster(props) {
    const {isOpen, toggle, user} = props;
    const [clusterName, setClusterName] = useState('');
    const [description, setDescription] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const contract = getContract();

    const createCluster = async () => {
        setIsCreating(true);
        await contract.createCluster(clusterName);
        toggle();

    }

    return (
        <>
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>Thêm Cụm</ModalHeader>
                <ModalBody>

                    <Form className="w-100">

                        <FormGroup>
                            <Label tag="h6">Tên Cụm</Label>
                            <Input
                                name="name"
                                type="text"
                                value={clusterName}
                                onChange={(event) => setClusterName(event.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label tag="h6">Mô tả</Label>
                            <Input
                                type="textarea"
                                className="mr-2"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={createCluster}
                        disabled={isCreating}
                    >
                        Tạo cụm
                    </Button>{" "}
                    <Button color="secondary" onClick={toggle}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

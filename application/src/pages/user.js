import {getSession, signOut} from "next-auth/react";
import {Button, Card, Form, FormGroup, Input, Label} from "reactstrap";
import {useEffect, useState} from "react";
import {useRouter} from 'next/router'
import ROLE from "./../core/constant/role";
import {getContract} from "@/core/utils/connect-contract";

function User({user}) {
    const [profile, setProfile] = useState();
    const [name, setName] = useState();
    const [role, setRole] = useState();
    const [isEditableRole, setIsEditableRole] = useState(false);
    const router = useRouter();
    useEffect(() => {
        const contract = getContract();
        contract.on('UserUpdated', (eventArgs) => {
            if (user.address == eventArgs){
                router.push('/user')
            }
        })
        getProfile(contract);
    }, []);


    const getProfile = async (contract) => {

        const profileCreated = await contract.getMe();
        setProfile({
            ...user,
            name: profileCreated.name,
            role: profileCreated.role,
        });
        setName(profileCreated.name);
        setRole(profileCreated.role);
        if (profileCreated.role != ROLE.NONE) {
            setIsEditableRole(true)

        }
    };

    const updateProfile = async () => {
        if (role == null) {
            console.error("role is null");
            return;
        }
        await getContract().updateUser(name, role)
    };

    return (
        <div className="flex-center " style={{height: "100vh"}}>
            <Card
                className="my-2 profile p-5"
                outline
                style={{
                    width: "18rem",
                }}
            >
                <h4 className="text-center mb-4">Thông tin người dùng</h4>
                {/* <pre>{JSON.stringify(profile, null, 2)}</pre> */}
                <Form className=" w-100">
                    <FormGroup>
                        <Label tag="h5">Định danh</Label>
                        {profile && (
                            <Input
                                name="address"
                                placeholder="địa chỉ người dùng"
                                type="text"
                                value={profile.address}
                                disabled
                            />
                        )}
                    </FormGroup>

                    <FormGroup>
                        <Label tag="h5">Tên</Label>
                        <Input
                            name="name"
                            placeholder="Tên người dùng"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label tag="h5">Quyền</Label>
                        <Input
                            require
                            name="role"
                            type="select"
                            value={role}
                            disabled={isEditableRole}
                            onChange={(e) => setRole(e.target.value)}
                            // style={{color: isEditableRole ? "black" : "white"}}
                        >
                            <option value={ROLE.NONE}>Chưa chọn</option>
                            <option value={ROLE.USER}>Người dùng</option>
                            <option value={ROLE.REVIEWER}>Người kiểm duyệt</option>
                        </Input>
                    </FormGroup>
                </Form>
                <div className="d-flex justify-content-between w-100">
                    <Button
                        color="danger"
                        size="sm"
                        onClick={() => signOut({redirect: "/"})}
                    >
                        Sign out
                    </Button>
                    <div>
                        <Button
                            color="primary"
                            size="sm"
                            onClick={updateProfile}
                        >
                            Save profile
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    // redirect if not authenticated
    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {user: session.user},
    };
}

export default User;

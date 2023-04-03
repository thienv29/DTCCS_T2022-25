import {getSession, signOut} from "next-auth/react";
import {Button, Card, Form, FormGroup, Input, Label} from "reactstrap";
import axios from "axios";
import {useEffect, useState} from "react";
import {useRouter} from 'next/router'
import ROLE from "./../core/constant/role";

function User({user}) {
    const [profile, setProfile] = useState();
    const [name, setName] = useState();
    const [role, setRole] = useState();
    const [isEditableRole, setIsEditableRole] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const getProfile = async () => {
            const profileCreated = (
                await axios.get("/api/user/get-user?address=" + user.address)
            ).data;
            setProfile({
                ...user,
                name: profileCreated.name,
                role: profileCreated.role,
            });
            setName(profileCreated.name);
            setRole(profileCreated.role);
            if (profileCreated.role != null) {
                setIsEditableRole(true)

            }
        };
        getProfile();
    }, [user]);

    const updateProfile = async () => {
        if (role == null) {
            console.error("role is null");
            return;
        }
        const userUpdated = await axios.post("/api/user/update", {
            address: profile.address,
            name,
            role,
        });
        if (userUpdated) {
            console.log("update profile success");
            router.push('/user')
        }
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
                            name="role"
                            type="select"
                            value={role}
                            disabled={isEditableRole}
                            onChange={(e) => setRole(e.target.value)}
                            style={{color: isEditableRole ? "black" : "white"}}
                        >
                            <option value={null}>Chưa chọn</option>
                            <option value={ROLE.STUDENT}>Học sinh</option>
                            <option value={ROLE.TEACHER}>Giáo viên</option>
                            <option value={ROLE.ADMIN}>Quản lý</option>
                        </Input>
                    </FormGroup>
                </Form>
                <div className="d-flex justify-content-between w-100">
                    <Button
                        color="danger"
                        size="sm"
                        onClick={() => signOut({redirect: "/signin"})}
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
                destination: "/signin",
                permanent: false,
            },
        };
    }

    return {
        props: {user: session.user},
    };
}

export default User;

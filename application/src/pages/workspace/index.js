import ROLE from "../../core/constant/role";
import {useRouter} from "next/router";
import {getSession} from "next-auth/react";
import {useEffect, useState} from "react";
import axios from "axios";
import WorkspaceAdmin from "@/components/local-page/workspace/workspace-admin";
import WorkspaceStudent from "@/components/local-page/workspace/workspace-student";
import WorkspaceTeacher from "@/components/local-page/workspace/workspace-teacher";

export default function Index({user}) {
    const [profile, setProfile] = useState();
    const router = useRouter();
    useEffect(() => {
        const getProfile = async () => {
            const profileCreated = (
                await axios.get("/api/user/get-user?address=" + user.address)
            ).data;
            if (profileCreated.role == null) {
                router.push("/user");
            }
            setProfile({
                ...user,
                name: profileCreated.name,
                role: profileCreated.role,
            });
        };
        getProfile();
    }, [user]);

    return (
        <>
            {profile && (
                <div className={'flex-center'}>
                    {profile.role == ROLE.ADMIN && <WorkspaceAdmin user={user}/>}
                    {profile.role == ROLE.STUDENT && <WorkspaceStudent user={user}/>}
                    {profile.role == ROLE.TEACHER && <WorkspaceTeacher user={user}/>}
                </div>
            )}
        </>
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

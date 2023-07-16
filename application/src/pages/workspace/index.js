import ROLE from "../../core/constant/role";
import {useRouter} from "next/router";
import {getSession} from "next-auth/react";
import {useEffect, useState} from "react";
import WorkspaceAdmin from "@/components/local-page/workspace/workspace-admin";
import WorkspaceUser from "@/components/local-page/workspace/workspace-user";
import {getContract} from "@/core/utils/connect-contract";

export default function Index({user}) {
    const [profile, setProfile] = useState();
    const router = useRouter();
    useEffect(() => {
        const getProfile = async () => {
            const profileCreated = await getContract().getMe();
            if (profileCreated.role == 0) {
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
                    {profile.role == ROLE.REVIEWER && <WorkspaceAdmin user={user}/>}
                    {profile.role == ROLE.USER && <WorkspaceUser user={user}/>}
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
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {user: session.user},
    };
}

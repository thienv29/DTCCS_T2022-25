import {useEffect, useState} from "react";
import {getSession} from "next-auth/react";
import SearchBox from "@/components/local-page/documents/search-box";
import SearchResult from "@/components/local-page/documents/search-result";
import {getContract} from "@/core/utils/connect-contract";

export default function Documents({user}) {
    const [documents, setDocuments] = useState([]);
    const [documentsFiltered, setDocumentsFiltered] = useState([]);
    const [searchText, setSeachText] = useState('');

    useEffect(() => {
        const contract = getContract();
        contract.on('FileUploaded', (eventArgs) => {
            if (eventArgs === user.address) {
                getDocuments(contract);
            }
        });
        contract.on('AcceptFileCluster', (eventArgs) => {
            if (eventArgs === user.address) {
                getDocuments(contract);
            }
        });
        contract.on('RejectFileCluster', (eventArgs) => {
            if (eventArgs === user.address) {
                getDocuments(contract);
            }
        });
        getDocuments(contract);
    }, [user]);

    useEffect(() => {
        setDocumentsFiltered(filterObjects(searchText, documents));
    }, [searchText])

    const handleSearch = (value) => {
        setSeachText(value);
    }

    function filterObjects(searchText, objects) {
        return objects.filter((object) =>
            Object.values(object).some((value) =>
                String(value).toLowerCase().includes(searchText.toLowerCase())
            )
        );
    }

    const getDocuments = async (contract) => {
        const result = await contract.getAllFilesAvailableNotMine();
        setDocuments(result)
        setDocumentsFiltered(filterObjects(searchText, result))
    };

    return (
        <>
            <div className={'flex-center flex-col '}>
                <div className={'workspace-container'}>
                    <SearchBox onSearch={handleSearch}/>
                    <SearchResult documents={documentsFiltered}/>
                </div>
            </div>

        </>
    )
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
        props: {
            user: session.user
        }
    }
}
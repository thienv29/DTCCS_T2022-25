// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

enum Status {
    PENDING,
    ACCEPTED,
    REJECTED
}

enum Role {
    NONE,
    REVIEWER,
    USER
}

struct File {
    string name;
    string description;
    string ipfsHash;
    address author;
    string createdAt;
    string catalog;
    Status isAvailable;
    mapping(address => bool) accessRequests;
    mapping(address => bool) accessList;
}
struct Cluster {
    address author;
    string name;
    uint countFile;
    mapping(uint => File) files;
}

struct User {
    address addressUser;
    string name;
    Role role;
}

struct FileData {
    uint id;
    string name;
    string description;
    string ipfsHash;
    string createdAt;
    string catalog;
    address author;
    string authorName;
    Status isAvailable;
    string clusterName;
    uint clusterId;
}

struct ClusterData {
    uint id;
    string name;
}

contract FileManage {
    // Structure to hold file details

    address admin;

    mapping(uint => Cluster) public clusters;
    uint public clusterCount;

    mapping(uint => User) public users;
    uint public userCount;

    constructor() {
        admin = msg.sender;
    }

    //Event to notify when the user signin
    event UserSignin(address indexed user);

    //Event to notify when the user update information
    event UserUpdated(address indexed user);

    // Event to notify when a file is uploaded
    event FileUploaded(
        address indexed uploader,
        uint indexed fileId,
        string name,
        string ipfsHash
    );

    // Event to notify when an access request is made
    event AccessRequested(address indexed requester, string cluserName, string fileName);

    // Event to notify when an access request is granted
    event AccessGranted(address indexed requester, string cluserName, string fileName);

    // Event to notify when an access is remove
    event AccessRemoved(address indexed requester, string cluserName, string fileName);

    event CreateCluster(address indexed creator, uint indexed clusterId);

    event AcceptFileCluster(address indexed creator, uint indexed clusterId);

    event RejectFileCluster(address indexed creator, uint indexed clusterId);

    function signin() public returns (User memory) {
        for (uint i = 0; i < userCount; i++) {
            if (users[i].addressUser == msg.sender) {
                return users[i];
            }
        }
        uint userId = userCount++;
        User storage user = users[userId];
        user.addressUser = msg.sender;
        user.name = "user";
        emit UserSignin(msg.sender);
        return user;
    }

    function updateUser(string memory _name, Role _role) public {
        for (uint i = 0; i < userCount; i++) {
            if (users[i].addressUser == msg.sender) {
                User storage user = users[i];
                user.addressUser = msg.sender;
                user.name = _name;
                user.role = _role;
                emit UserUpdated(msg.sender);
                return;
            }
        }
    }

    // Function to create cluster
    function createCluster(string memory _name) public {
        uint clusterId = clusterCount++;
        Cluster storage clus = clusters[clusterId];
        clus.name = _name;
        clus.author = msg.sender;
        emit CreateCluster(msg.sender, clusterId);
    }

    // Function to create File
    function createFile(
        string memory _name,
        string memory _description,
        string memory _ipfsHash,
        string memory _createdAt,
        string memory _catalog,
        uint _idCluster
    ) public {
        uint fileId = clusters[_idCluster].countFile++;
        File storage f = clusters[_idCluster].files[fileId];
        f.name = _name;
        f.description = _description;
        f.ipfsHash = _ipfsHash;
        f.author = msg.sender;
        f.createdAt = _createdAt;
        f.catalog = _catalog;
        f.isAvailable = Status.PENDING;
        emit FileUploaded(msg.sender, fileId, _name, _ipfsHash);
    }

    //function to accept file upload to cluster
    function acceptFile(uint _idCluster, uint _fileId) public {
        File storage f = clusters[_idCluster].files[_fileId];
        f.isAvailable = Status.ACCEPTED;
        emit AcceptFileCluster(f.author, _idCluster);
    }

    //function to reject file of cluster
    function rejectFile(uint _idCluster, uint _fileId) public {
        File storage f = clusters[_idCluster].files[_fileId];
        f.isAvailable = Status.REJECTED;
        emit RejectFileCluster(f.author, _idCluster);
    }

    //function to request access files
    function requestAccess(uint _idCluster, uint _fileId) public {
        File storage f = clusters[_idCluster].files[_fileId];
        require(f.isAvailable == Status.ACCEPTED, "File is not available");
        require(!f.accessRequests[msg.sender], "File is requesting access");
        require(!f.accessList[msg.sender], "File is granted access");

        f.accessRequests[msg.sender] = true;
        emit AccessRequested(msg.sender,  clusters[_idCluster].name, f.name);
    }

    //function to grant access file
    function grantAccess(
        uint _idCluster,
        uint _fileId,
        address _requester
    ) public {
        File storage f = clusters[_idCluster].files[_fileId];
        require(f.isAvailable == Status.ACCEPTED, "File is not available");
        require(
            f.accessRequests[_requester],
            "No access request from this address"
        );
        require(f.author == msg.sender, "you are not author");

        f.accessList[_requester] = true;
        f.accessRequests[_requester] = false;
        emit AccessGranted(_requester, clusters[_idCluster].name, f.name);
    }

    //funtion to remove access file
    function removeAccess(
        uint _idCluster,
        uint _fileId,
        address _requester
    ) public {
        File storage f = clusters[_idCluster].files[_fileId];
        require(f.isAvailable == Status.ACCEPTED, "File is not available");
        f.accessRequests[_requester] = false;
        f.accessList[_requester] = false;
        emit AccessRemoved(_requester, clusters[_idCluster].name, f.name);
    }

    function getMe() public view returns (User memory user) {
        for (uint i = 0; i < userCount; i++) {
            if (users[i].addressUser == msg.sender) {
                return users[i];
            }
        }
    }

    function getClusters() public view returns (ClusterData[] memory) {
        ClusterData[] memory clusterCreateds = new ClusterData[](clusterCount);
        for (uint i = 0; i < clusterCount; i++) {
            Cluster storage cluster = clusters[i];
            ClusterData memory clusterData = clusterCreateds[i];
            clusterData.id = i;
            clusterData.name = cluster.name;
        }
        return clusterCreateds;
    }

    function getClustersByAuthor() public view returns (ClusterData[] memory) {
        ClusterData[] memory clusterCreateds = new ClusterData[](clusterCount);
        for (uint i = 0; i < clusterCount; i++) {
            Cluster storage cluster = clusters[i];
            if (cluster.author == msg.sender) {
                ClusterData memory clusterData = clusterCreateds[i];
                clusterData.id = i;
                clusterData.name = cluster.name;
            }
        }
        return clusterCreateds;
    }

    function getClusterById(
        uint _clusterId
    ) public view returns (ClusterData memory) {
        Cluster storage cluster = clusters[_clusterId];
        ClusterData memory clusterData = ClusterData(_clusterId, cluster.name);
        return clusterData;
    }

    function getFilesByMe() public view returns (FileData[] memory) {
        uint totalFiles = 0;
        for (uint i = 0; i < clusterCount; i++) {
            totalFiles += clusters[i].countFile;
        }

        FileData[] memory files = new FileData[](totalFiles);
        uint fileCount = 0;

        for (uint i = 0; i < clusterCount; i++) {
            Cluster storage cluster = clusters[i];
            for (uint j = 0; j < cluster.countFile; j++) {
                File storage file = cluster.files[j];
                if (file.author == msg.sender) {
                    FileData memory fileData = files[fileCount];
                    fileData.id = fileCount;
                    fileData.name = file.name;
                    fileData.description = file.description;
                    fileData.ipfsHash = file.ipfsHash;
                    fileData.author = file.author;
                    fileData.createdAt = file.createdAt;
                    fileData.isAvailable = file.isAvailable;
                    fileData.clusterId = i;
                    fileCount++;
                }
            }
        }

        // Resize the array to remove any unused elements
        assembly {
            mstore(files, fileCount)
        }

        return files;
    }

    function getFilesByCluster(
        uint _idCluster
    ) public view returns (FileData[] memory) {
        FileData[] memory files = new FileData[](
            clusters[_idCluster].countFile
        );
        uint fileCount = 0;

        for (uint j = 0; j < clusters[_idCluster].countFile; j++) {
            File storage file = clusters[_idCluster].files[j];
            FileData memory fileData = files[fileCount];
            fileData.id = fileCount;
            fileData.name = file.name;
            fileData.description = file.description;
            fileData.ipfsHash = file.ipfsHash;
            fileData.author = file.author;
            fileData.authorName = getUserNameByAddress(file.author);
            fileData.createdAt = file.createdAt;
            fileData.catalog = file.catalog;
            fileData.isAvailable = file.isAvailable;
            fileCount++;
        }

        // Resize the array to remove any unused elements
        assembly {
            mstore(files, fileCount)
        }

        return files;
    }

    function getAllRequestedFiles(
        uint _clusterId,
        uint _fileId
    ) public view returns (User[] memory) {
        User[] memory userResponse = new User[](userCount);
        uint userCountCreated = 0;
        for (uint i = 0; i < userCount; i++) {
            if (
                clusters[_clusterId].files[_fileId].accessRequests[
                    users[i].addressUser
                ] == true
            ) {
                userResponse[userCountCreated] = users[i];
                userCountCreated++;
            }
        }
        // Resize the array to remove any unused elements
        assembly {
            mstore(userResponse, userCountCreated)
        }
        return userResponse;
    }

    function getAllUserAccessFile(
        uint _clusterId,
        uint _fileId
    ) public view returns (User[] memory) {
        User[] memory userResponse = new User[](userCount);
        uint userCountCreated = 0;
        for (uint i = 0; i < userCount; i++) {
            if (
                clusters[_clusterId].files[_fileId].accessList[
                    users[i].addressUser
                ] == true
            ) {
                userResponse[userCountCreated] = users[i];
                userCountCreated++;
            }
        }
        // Resize the array to remove any unused elements
        assembly {
            mstore(userResponse, userCountCreated)
        }
        return userResponse;
    }

    function getAllFilesAvailableNotMine()
        public
        view
        returns (FileData[] memory)
    {
        uint totalFiles = 0;
        for (uint i = 0; i < clusterCount; i++) {
            totalFiles += clusters[i].countFile;
        }

        FileData[] memory files = new FileData[](totalFiles);
        uint fileCount = 0;

        for (uint i = 0; i < clusterCount; i++) {
            Cluster storage cluster = clusters[i];
            for (uint j = 0; j < cluster.countFile; j++) {
                File storage file = cluster.files[j];
                if (
                    file.isAvailable == Status.ACCEPTED &&
                    file.author != msg.sender
                ) {

                    FileData memory fileData = files[fileCount];
                    fileData.id = j;
                    fileData.name = file.name;
                    fileData.description = file.description;
                    fileData.author = file.author;
                    fileData.authorName = getUserNameByAddress(file.author);
                    fileData.createdAt = file.createdAt;
                    fileData.catalog = file.catalog;
                    fileData.isAvailable = file.isAvailable;
                    if (file.accessList[msg.sender]) {
                        fileData.ipfsHash = file.ipfsHash;
                    } else {
                        fileData.ipfsHash = "";
                    }
                    fileCount++;
                }
            }
        }

        // Resize the array to remove any unused elements
        assembly {
            mstore(files, fileCount)
        }

        return files;
    }

    function getUserNameByAddress(
        address _addrss
    ) public view returns (string memory userName) {
        for (uint i = 0; i < userCount; i++) {
            if (users[i].addressUser == _addrss) {
                return users[i].name;
            }
        }
    }

    function getFilesGrantedAccess(
        address _user
    ) public view returns (FileData[] memory) {
        uint totalFiles = 0;

        // Count the total number of files granted access to the user
        for (uint i = 0; i < clusterCount; i++) {
            Cluster storage cluster = clusters[i];
            for (uint j = 0; j < cluster.countFile; j++) {
                File storage file = cluster.files[j];
                if (file.accessList[_user]) {
                    totalFiles++;
                }
            }
        }

        // Create an array to store the file data of all files granted access to the user
        FileData[] memory filesGrantedAccess = new FileData[](totalFiles);
        uint index = 0;

        // Populate the array with file data of all files granted access to the user
        for (uint i = 0; i < clusterCount; i++) {
            Cluster storage cluster = clusters[i];
            for (uint j = 0; j < cluster.countFile; j++) {
                File storage file = cluster.files[j];
                if (file.accessList[_user]) {
                    FileData memory fileData = FileData({
                        id: j,
                        name: file.name,
                        description: file.description,
                        ipfsHash: file.ipfsHash,
                        createdAt: file.createdAt,
                        catalog: file.catalog,
                        author: file.author,
                        authorName: getUserNameByAddress(file.author),
                        isAvailable: file.isAvailable,
                        clusterName: cluster.name,
                        clusterId: i
                    });
                    filesGrantedAccess[index++] = fileData;
                }
            }
        }

        return filesGrantedAccess;
    }
}

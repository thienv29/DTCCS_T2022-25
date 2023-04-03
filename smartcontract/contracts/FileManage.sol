// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "https://github.com/ipfs/interface-ipfs-core/blob/master/src/utils/multihash.js";
// import "https://github.com/ipfs/interface-ipfs-core/blob/master/src/utils.js";

contract FileManage {
    // Structure to hold file details

    address admin;
    enum Status {
        PENDING,
        ACCEPTED,
        REJECTED
    }
    struct File {
        string name;
        string description;
        string ipfsHash;
        address author;
        string createdAt;
        Status isAvailable;
        mapping(address => bool) accessRequests;
        mapping(address => bool) accessList;
    }
    struct Cluster {
        string name;
        uint256 countFile;
        mapping(uint256 => File) files;
    }

    mapping(uint256 => Cluster) public clusters;
    uint256 public clusterCount;
    string[] clusterNames;

    constructor() {
        admin = msg.sender;
    }

    // Event to notify when a file is uploaded
    event FileUploaded(
        address indexed uploader,
        uint256 indexed fileId,
        string name,
        string ipfsHash
    );

    // Event to notify when an access request is made
    event AccessRequested(address indexed requester, uint256 indexed fileId);

    // Event to notify when an access request is granted
    event AccessGranted(address indexed requester, uint256 indexed fileId);

    // Event to notify when an access request is rejected
    event AccessRejected(address indexed requester, uint256 indexed fileId);

    event CreateCluster(address indexed creator, uint256 indexed clusterId);

    event AcceptFileCluster(address indexed creator, uint256 indexed clusterId);
    event RejectFileCluster(address indexed creator, uint256 indexed clusterId);

    struct ClusterData {
        uint256 id;
        string name;
    }

    // Function to create cluster
    function createCluster(string memory _name) public {
        require(msg.sender == admin, "File is not available");
        uint256 clusterId = clusterCount++;
        Cluster storage clus = clusters[clusterId];
        clus.name = _name;
        clusterNames.push(_name);
        emit CreateCluster(msg.sender, clusterId);
    }

    function getClusters() public view returns (ClusterData[] memory) {
        ClusterData[] memory clusterCreateds = new ClusterData[](clusterCount);
        for (uint256 i = 0; i < clusterCount; i++) {
            Cluster storage cluster = clusters[i];
            ClusterData memory clusterData = clusterCreateds[i];
            clusterData.id = i;
            clusterData.name = cluster.name;
        }
        return clusterCreateds;
    }

    function getClusterById(
        uint256 _clusterId
    ) public view returns (ClusterData memory) {
        Cluster storage cluster = clusters[_clusterId];
        ClusterData memory clusterData = ClusterData(_clusterId, cluster.name);
        return clusterData;
    }

    // Function to create File
    function createFile(
        string memory _name,
        string memory _description,
        string memory _ipfsHash,
        string memory _createdAt,
        uint256 _idCluster
    ) public {
        uint256 fileId = clusters[_idCluster].countFile++;
        File storage f = clusters[_idCluster].files[fileId];
        f.name = _name;
        f.description = _description;
        f.ipfsHash = _ipfsHash;
        f.author = msg.sender;
        f.createdAt = _createdAt;
        f.isAvailable = Status.PENDING;
        emit FileUploaded(msg.sender, fileId, _name, _ipfsHash);
    }

    function acceptFile(uint256 _idCluster, uint256 _fileId) public {
        File storage f = clusters[_idCluster].files[_fileId];
        require(msg.sender == admin, "Only admin can accept file");
        require(f.isAvailable == Status.PENDING, "File is not pending");
        f.isAvailable = Status.ACCEPTED;
        emit AcceptFileCluster(f.author, _idCluster);
    }

    function rejectFile(uint256 _idCluster, uint256 _fileId) public {
        File storage f = clusters[_idCluster].files[_fileId];
        require(msg.sender == admin, "Only admin can reject file");
        require(f.isAvailable == Status.PENDING, "File is not pending");
        f.isAvailable = Status.REJECTED;
        emit RejectFileCluster(f.author, _idCluster);
    }

    struct FileData {
        uint256 id;
        string name;
        string description;
        string ipfsHash;
        string createdAt;
        address author;
        Status isAvailable;
    }

    function getFilesByMe() public view returns (FileData[] memory) {
        uint256 totalFiles = 0;
        for (uint256 i = 0; i < clusterCount; i++) {
            totalFiles += clusters[i].countFile;
        }

        FileData[] memory files = new FileData[](totalFiles);
        uint256 fileCount = 0;

        for (uint256 i = 0; i < clusterCount; i++) {
            Cluster storage cluster = clusters[i];
            for (uint256 j = 0; j < cluster.countFile; j++) {
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
        uint256 _idCluster
    ) public view returns (FileData[] memory) {
        FileData[] memory files = new FileData[](
            clusters[_idCluster].countFile
        );
        uint256 fileCount = 0;

        for (uint256 j = 0; j < clusters[_idCluster].countFile; j++) {
            File storage file = clusters[_idCluster].files[j];
            FileData memory fileData = files[fileCount];
            fileData.id = fileCount;
            fileData.name = file.name;
            fileData.description = file.description;
            fileData.ipfsHash = file.ipfsHash;
            fileData.author = file.author;
            fileData.createdAt = file.createdAt;
            fileData.isAvailable = file.isAvailable;
            fileCount++;
        }

        // Resize the array to remove any unused elements
        assembly {
            mstore(files, fileCount)
        }

        return files;
    }

    function getAllFilesAvailable() public view returns (FileData[] memory) {
        uint256 totalFiles = 0;
        for (uint256 i = 0; i < clusterCount; i++) {
            totalFiles += clusters[i].countFile;
        }

        FileData[] memory files = new FileData[](totalFiles);
        uint256 fileCount = 0;

        for (uint256 i = 0; i < clusterCount; i++) {
            Cluster storage cluster = clusters[i];
            for (uint256 j = 0; j < cluster.countFile; j++) {
                File storage file = cluster.files[j];
                if (file.isAvailable == Status.ACCEPTED) {
                    FileData memory fileData = files[fileCount];
                    fileData.name = file.name;
                    fileData.description = file.description;
                    fileData.ipfsHash = file.ipfsHash;
                    fileData.author = file.author;
                    fileData.createdAt = file.createdAt;
                    fileData.isAvailable = file.isAvailable;
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
}

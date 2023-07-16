// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import Moralis from "moralis";
import {removeSpace} from "@/core/utils/removeSpace";

export const config = {
    api: {
        bodyParser: false,
    },
};

const readFile = (req, saveLocally) => {
    const options = {};
    if (saveLocally) {
        options.uploadDir = path.join(process.cwd(), "/public/files");
        options.filename = (name, ext, path, form) => {
            return Date.now().toString() + "_" + removeSpace(path.originalFilename);
        };
    }
    options.maxFileSize = 4000 * 1024 * 1024;
    const form = formidable(options);
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({fields, files});
        });
    });
};

const saveToIPFS = async (newFilename) => {
    try {
        await Moralis.start({
            apiKey: process.env.MORALIS_API_KEY,
        });
    } catch (e) {
        console.log(e)
    }
    const abi = [
        {
            path: newFilename,
            content: await fs.readFile(process.cwd() + '/public/files/'+newFilename, {encoding: 'base64'}),
        },
    ];
    return await Moralis.EvmApi.ipfs.uploadFolder({abi});
}
export default async function handler(req, res) {
    try {
        await fs.readdir(path.join(process.cwd() + "/public", "/files"));
    } catch (error) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/files"));
    }
    const fileUploaded = await readFile(req, true);
    const response = await saveToIPFS(fileUploaded.files.myFile.newFilename);
    await fs.unlink(path.join(process.cwd() + "/public", "/files", fileUploaded.files.myFile.newFilename));
    return res.json(response);
}

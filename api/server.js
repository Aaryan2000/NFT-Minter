// const express = require('express')
// const multer = require('multer')
// const cors = require('cors');
// const axios = require('axios')
// const app = express()
// const port=process.env.PORT || 5000

// app.use(express.json())
// const upload=multer({
// limits:{
//     fileSize:1000000
// }
// })

// const starton = axios.create({
//     baseURL: "https://api.starton.io/v3",
//     headers: {
//         "x-api-key": "sk_live_4736316b-a74f-4faa-ba4a-e13c20ce587a",
//     },
//   })


//   app.post('/upload',cors(),upload.single('file'),async(req,res)=>{
   
//     let data = new FormData();//taking images from client side
//     const blob = new Blob([req.file.buffer],{type:req.file.mimetype});
//     data.append("file",blob,{filename:req.file.originalnam})
//     data.append("isSync","true");

//     async function uploadImageOnIpfs(){
//         const ipfsImg = await starton.post("/ipfs/file", data, {
//             headers: { "Content-Type": `multipart/form-data; boundary=${data._boundary}` },
//           })
//           return ipfsImg.data;
//     }
//     async function uploadMetadataOnIpfs(imgCid){//information of your own NFT
//         const metadataJson = {
//             name: `A Wonderful NFT`,
//             description: `Probably the most awesome NFT ever created !`,
//             image: `ipfs://ipfs/${imgCid}`,
//         }
//         const ipfsMetadata = await starton.post("/ipfs/json", {//For interaction with ipfs
//             name: "My NFT metadata Json",
//             content: metadataJson,
//             isSync: true,
//         })
//         return ipfsMetadata.data;
//     }


//     const SMART_CONTRACT_NETWORK="polygon-mumbai"
//     const SMART_CONTRACT_ADDRESS="0xD94751D39F412AcEDC807fA40f10B41059FBc331"
//     const WALLET_IMPORTED_ON_STARTON="0xBE84Da2FbB81Feac5f9D5A3c7016a4aB42f1A94b";
//     async function mintNFT(receiverAddress,metadataCid){
//         const nft = await starton.post(`/smart-contract/${SMART_CONTRACT_NETWORK}/${SMART_CONTRACT_ADDRESS}/call`, {//starton API inorder to connect with B.C
//             functionName: "mint",
//             signerWallet: WALLET_IMPORTED_ON_STARTON,
//             speed: "low",
//             params: [receiverAddress, metadataCid],
//         })
//         return nft.data;
//     }
    
//     const RECEIVER_ADDRESS = "  "
//     const ipfsImgData = await uploadImageOnIpfs();//calling uploadImageOnIpfs() function :To upload image on ipfs
//     const ipfsMetadata = await uploadMetadataOnIpfs(ipfsImgData.cid);//calling uploadMetadataOnIpfs() function:upload metadata of the image on ipfs
//     const nft=await mintNFT(RECEIVER_ADDRESS,ipfsMetadata.cid);//calling mintNFT function for minting ipfs data/image
//     console.log(ipfsImgData,ipfsMetadata);
//     res.status(201).json({
//         transactionHash:nft.transactionHash,
//         cid:ipfsImgData.cid
//     })
//   })
//   app.listen(port,()=>{
//     console.log('server is running on the port' + port);
//   })

const express = require('express')
const multer = require('multer')
const cors = require('cors');
const axios = require('axios')
const app = express()
const port=process.env.PORT || 5000

app.use(express.json())

const upload = multer({
    limits:{
        fileSize:1000000
    }
})

const starton = axios.create({
    baseURL: "https://api.starton.io/v3",
    headers: {
        "x-api-key": "sk_live_4736316b-a74f-4faa-ba4a-e13c20ce587a",
    },
  })

  app.post('/upload',cors(),upload.single('file'),async(req,res)=>{
   
    let data = new FormData();
    const blob = new Blob([req.file.buffer],{type:req.file.mimetype});
    data.append("file",blob,{filename:req.file.originalnam})
    data.append("isSync","true");

    async function uploadImageOnIpfs(){
        const ipfsImg = await starton.post("/ipfs/file", data, {
            headers: { "Content-Type": `multipart/form-data; boundary=${data._boundary}` },
          })
          return ipfsImg.data;//useful when we get the cid of the image
    }
    async function uploadMetadataOnIpfs(imgCid){
        const metadataJson = {
            name: `A Wonderful NFT`,//name of nft
            description: `Probably the most awesome NFT ever created !`,
            image: `ipfs://ipfs/${imgCid}`,//imgCid is unique cid of image
        }
        const ipfsMetadata = await starton.post("/ipfs/json", {
            name: "My NFT metadata Json",
            content: metadataJson,
            isSync: true,
        })
        return ipfsMetadata.data;//useful inorder to get the ipfs meta data
    }
    
    const SMART_CONTRACT_NETWORK="polygon-mumbai"
    const SMART_CONTRACT_ADDRESS="0xD94751D39F412AcEDC807fA40f10B41059FBc331"
    const WALLET_IMPORTED_ON_STARTON="0xBE84Da2FbB81Feac5f9D5A3c7016a4aB42f1A94b";
    async function mintNFT(receiverAddress,metadataCid){
        const nft = await starton.post(`/smart-contract/${SMART_CONTRACT_NETWORK}/${SMART_CONTRACT_ADDRESS}/call`, {
            functionName: "mint",
            signerWallet: WALLET_IMPORTED_ON_STARTON,
            speed: "low",
            params: [receiverAddress, metadataCid],
        })
        return nft.data;
    }
    const RECEIVER_ADDRESS = "0xc8E053949754Bb8468351b1094e6c25acBb3Db72"
    const ipfsImgData = await uploadImageOnIpfs();
    const ipfsMetadata = await uploadMetadataOnIpfs(ipfsImgData.cid);
    const nft = await mintNFT(RECEIVER_ADDRESS,ipfsMetadata.cid)
    console.log(nft)
    res.status(201).json({
        transactionHash:nft.transactionHash,
        cid:ipfsImgData.cid
    })
  })
  app.listen(port,()=>{
    console.log('Server is running on port '+ port);
  })
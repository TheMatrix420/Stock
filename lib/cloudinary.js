import cloudinary from 'cloudinary'

cloudinary.config({
    cloud_name: 'dngxa0epd',
    api_key: '946678255297199',
    api_secret:	'I6dzLDIUDB2w9V-V4KUry5geOiw'
})

async function uploader(file){
     try {
        const res = await cloudinary.v2.uploader.upload(file,{folder:'test'})
        return res
    } catch (error) {
        return "no-image"
    } 
}

async function delet(url){
    try {
        const res =await cloudinary.v2.uploader.destroy(url)
        return res
    } catch (error) {
        return 'no se elimino'
    }
}
export default {
    uploader,delet
}
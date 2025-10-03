import { IParcel } from "./percel.interface";
import { Parcel } from "./percel.model";



const createPercel = async(payload : IParcel) =>{

    const existingPercel = await Parcel.findOne({trackingId : payload.trackingId})
    
    if(existingPercel){
        throw new Error("This parcel is already exists")
    }

    const parcel = await Parcel.create(payload)

    return parcel

}






export const ParcelService = {
    createPercel
}



import type { ObjectId } from "mongodb";
import type { ChangeRequestType } from "./ChangeRequest.ts";

export interface Notification {
    _id?: ObjectId,
    userId: ObjectId,        // destinataire (requester)
    type: "CHANGE_REQUEST"
    title: string,
    message: string,
    read: boolean,
    createdAt: Date,
    changeRequestId:ObjectId,
    personId?:ObjectId
  }
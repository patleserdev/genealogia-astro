// src/types/loginLog.ts

import type { ObjectId } from 'mongodb'

export interface LoginLog {
  _id?:       ObjectId
  userId:     ObjectId | null  // null si email inconnu
  email:      string
  ip:         string | null
  userAgent:  string | null
  createdAt:  Date
  success:    boolean
}
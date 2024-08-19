import express from 'express'
import getFriends from '../controllers/friends.js';
import getLeaders from '../controllers/leaders.js';
import getQuestion from '../controllers/fetchQuestion.js';
import addQuestion from '../controllers/addQuestion.js';
import updateResponse from '../controllers/updateResponse.js';
import getEarnings from '../controllers/getEarnings.js';
const router = express.Router();

router.get("/friends", getFriends)
router.get('/leaders', getLeaders)
router.get('/questions/get', getQuestion)
router.post('/question/set', addQuestion)
router.post('/response', updateResponse)
router.get('/earnings', getEarnings)

export {router}
import express from 'express'
import getFriends from '../controllers/friends.js';
import getLeaders from '../controllers/leaders.js';
import getQuestion from '../controllers/fetchQuestion.js';
import addQuestion from '../controllers/addQuestion.js';
import updateResponse from '../controllers/updateresponse.js';
import getEarnings from '../controllers/getEarnings.js';
import updateMembership from '../controllers/updateMembership.js';
import addTask from '../controllers/addTask.js'
import updateSocialResponse from '../controllers/updateSocialActivity.js';
import getTasks from '../controllers/getTasks.js';
import updateEarnings from '../controllers/updateEarnings.js';
import getFriendsCount from '../controllers/getFriendsCount.js';
const router = express.Router();

router.get("/friends", getFriends)
router.get('/leaders', getLeaders)
router.get('/questions/get', getQuestion)
router.post('/question/set', addQuestion)
router.post('/response', updateResponse)
router.get('/earnings', getEarnings)
router.post('/earnings/update', updateEarnings)
router.post('/membership', updateMembership)
router.post('/tasks/set', addTask)
router.post('/tasks/update', updateSocialResponse)
router.get('/tasks/get', getTasks)
router.get('/friends/count', getFriendsCount)
export {router}
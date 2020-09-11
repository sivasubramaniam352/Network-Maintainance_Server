const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport  = require('passport');
require('../middlewares/passAuth')(passport)
const usrCtrl = require('../controllers/userController');
const issCltrl = require('../controllers/issuesContrller')


router.post('/userReg', usrCtrl.create)
router.get('/usersGet', usrCtrl.getAll)
router.delete('/userDel',passport.authenticate('jwt',{session:false}), usrCtrl.deleteUser)
router.post('/userLog', usrCtrl.login)
router.put('/userUp', passport.authenticate('jwt',{session:false}), usrCtrl.update)
router.post('/getUser', passport.authenticate('jwt',{session:false}), usrCtrl.getUser)


//issues

router.post('/isCreate',passport.authenticate('jwt',{session:false}), issCltrl.create)
router.get('/getIssues', passport.authenticate('jwt',{session:false}), issCltrl.getIssues)
router.put('/issueUp',passport.authenticate('jwt',{session:false}), issCltrl.updateIssues)
router.get('/issuePop',passport.authenticate('jwt',{session:false}), issCltrl.userPop)

module.exports = router;
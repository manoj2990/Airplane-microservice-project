const { Router} = require("express");
const v1Routes = require("./v1/index.js");
const router = Router();

router.use('/v1', v1Routes);
router.post('/info', (req, res) => {
  
  const userInfo = req.headers['x-user-info'] ? JSON.parse(req.headers['x-user-info']) : undefined;

 
  return res.status(200).json({ 
  
    message: 'Welcome to booking service' });
});

module.exports = router;

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('./user.model');

const register = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    const userDuplicate = await User.findOne({
      username: newUser.username,
    });
    if (userDuplicate) return next('User exists');

    const newUserDB = newUser.save();
    return res.json({
      status: 201,
      message: 'user registered',
      data: newUserDB.username,
    });
  } catch (error) {
    console.log('user register failed');
  }
};

const login = async (req, res, next) => {
  try {
    const userInfo = await User.findOne({
      username: req.body.username,
    });

    if (bcrypt.compareSync(req.body.password, userInfo.password)) {
      userInfo.password = null;
      const token = jwt.sign(
        {
          id: userInfo._id,
          username: userInfo.username,
        },
        req.app.get('secretKey'),
        { expiresIn: '2h' }
      );
      return res.json({
        status: 200,
        message: 'welcome',
        token: token,
      });
    } else {
      return next('incorrect password');
    }
  } catch (error) {
    console.log('user login failed');
  }
};

module.exports = { register, login };

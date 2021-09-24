const Login = require('../models/loginModel');

exports.index = (req, res) => {
  res.render('login');
};

exports.register = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.register();

    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(() => res.redirect('/login/index'));
    } else {
      req.flash('success', 'Seu usuario foi criado com sucesso');
      req.session.save(() => res.redirect('/login/index'));
      res.send(login.body);
    }
  } catch (e) {
    res.render('404');
  }
};
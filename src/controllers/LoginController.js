const Login = require('../models/LoginModel');

exports.index = (req, res) => {
  console.log(req.session.user);
  res.render('login');
};

exports.register = (req, res) => {
  const login = new Login(req.body);
  const register = new Promise((resolve) => resolve(login.register()));
  register.then(() => {
    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(() => res.redirect('/login/index'));
    } else {
      req.flash('success', 'Seu usuario foi criado com sucesso');
      req.session.save(() => res.redirect('/login/index'));
      /* res.send(login.body); */
    }
  }).catch();
};

exports.login = (req, res) => {
  const login = new Login(req.body);
  const sera = new Promise((resolve) => resolve(login.login()));
  sera.then(() => {
    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(() => res.redirect('/login/index'));
    } else {
      req.flash('success', 'Logado com sucesso');
      req.session.user = login.user;
      res.locals.user = req.session.user;
      res.redirect('/');
      /* req.session.save(() => res.redirect('/login/index')); */
      /* res.send(login.body); */
    }
  }).catch();
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login/index');
};
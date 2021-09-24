const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcrypt');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    try {
      this.validation();
      if (this.errors.length > 0) return;
      this.user = await LoginModel.findOne({ email: this.body.email });

      if (!this.user) {
        this.errors.push('Usuario não existe');
        return;
      }

      if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
        this.errors.push('Senha inválida');
        this.user = null;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async register() {
    this.validation();

    if (this.errors.length > 0) return;

    await this.userExist();

    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);
    this.user = await LoginModel.create(this.body);
  }

  async userExist() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if (this.user) this.errors.push('Usuario já cadastrado');
  }

  validation() {
    this.cleanUp();

    if (!validator.isEmail(this.body.email)) {
      this.errors.push('Email inválido');
    }
    if (this.body.password.length < 3 || this.body.password.length >= 50) {
      this.errors.push('Senha precisa ter entre 3 a 50 caracteres');
    }
  }

  cleanUp() {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }
    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;
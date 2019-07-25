import chai from 'chai';
import sinon from 'sinon';

import { createConnection } from './../../src/helpers/database';
import { UserRepository } from './../../src/repository/user';

import { truncate, seed } from './../helpers/repository/user';

const expect = chai.expect;

const userRepository = UserRepository(createConnection('dev'));

describe('findAll', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should return 2 users', async function() {
    const spy = sinon.spy(userRepository, 'findAll');
    
    const result = await userRepository.findAll();

    spy.restore();

    expect(result).to.eql([
      {
        id: 1,
        name: 'Cristopher Namchee',
        email: 'haha@gmail.com',
        is_admin: 0,
      },
      {
        id: 2,
        name: 'Gunawan Christanto',
        email: 'testmail@gmail.com',
        is_admin: 1,
      },
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy);
  });
});

describe('findByEmail', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should return 2 users', async function() {
    const spy = sinon.spy(userRepository, 'findByEmail');
    const expectedArgs = { email: 'gmail.com' };

    const result = await userRepository.findByEmail(expectedArgs);

    spy.restore();

    expect(result).to.eql([
      {
        id: 1,
        name: 'Cristopher Namchee',
        email: 'haha@gmail.com',
        is_admin: 0,
      },
      {
        id: 2,
        name: 'Gunawan Christanto',
        email: 'testmail@gmail.com',
        is_admin: 1,
      },
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return a user', async function() {
    const spy = sinon.spy(userRepository, 'findByEmail');
    const expectedArgs = { email: 'haha' };

    const result = await userRepository.findByEmail(expectedArgs);

    spy.restore();
    
    expect(result).to.eql([
      {
        id: 1,
        name: 'Cristopher Namchee',
        email: 'haha@gmail.com',
        is_admin: 0,
      },
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return an empty array', async function() {
    const spy = sinon.spy(userRepository, 'findByEmail');
    const expectedArgs = { email: 'DOOMED' };

    const result = await userRepository.findByEmail(expectedArgs);

    spy.restore();

    expect(result).to.eql([]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

describe('findByName', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should return 2 users', async function() {
    const spy = sinon.spy(userRepository, 'findByName');
    const expectedArgs = { name: 'c' };

    const result = await userRepository.findByName(expectedArgs);

    spy.restore();

    expect(result).to.eql([
      {
        id: 1,
        name: 'Cristopher Namchee',
        email: 'haha@gmail.com',
        is_admin: 0,
      },
      {
        id: 2,
        name: 'Gunawan Christanto',
        email: 'testmail@gmail.com',
        is_admin: 1,
      },
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return a user', async function() {
    const spy = sinon.spy(userRepository, 'findByName');
    const expectedArgs = { name: 'Gunawan Christanto' };

    const result = await userRepository.findByName(expectedArgs);

    spy.restore();
    
    expect(result).to.eql([
      {
        id: 2,
        name: 'Gunawan Christanto',
        email: 'testmail@gmail.com',
        is_admin: 1,
      },
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return an empty array', async function() {
    const spy = sinon.spy(userRepository, 'findByName');
    const expectedArgs = { name: 'DOOMED' };

    const result = await userRepository.findByName(expectedArgs);

    spy.restore();

    expect(result).to.eql([]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
})

describe('findById', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should return a user', async function() {
    const spy = sinon.spy(userRepository, 'findById');
    const expectedArgs = { id: 1 };

    const result = await userRepository.findById(expectedArgs);

    spy.restore();

    expect(result).to.eql([
      {
        id: 1,
        name: 'Cristopher Namchee',
        email: 'haha@gmail.com',
        is_admin: 0,
      },
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return an empty array', async function() {
    const spy = sinon.spy(userRepository, 'findById');
    const expectedArgs = { id: 10000 };

    const result = await userRepository.findById(expectedArgs);

    spy.restore();

    expect(result).to.eql([]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

describe('exist', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should return true because it exists in the database', async function() {
    const spy = sinon.spy(userRepository, 'exist');
    const expectedArgs = { id: 1 };

    const result = await userRepository.exist(expectedArgs);
    const processed = result[0].jml > 0;

    spy.restore();

    expect(processed).to.be.true;

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return false because it doesn\'t exist in the database', async function() {
    const spy = sinon.spy(userRepository, 'exist');
    const expectedArgs = { id: 6969 };

    const result = await userRepository.exist(expectedArgs);
    const processed = result[0].jml > 0;

    spy.restore();

    expect(processed).to.be.false;

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

describe('create', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should create 1 new user', async function() {
    const spy = sinon.spy(userRepository, 'create');
    const expectedArgs = {
      email: 'test123@gmail.com',
      name: 'test',
      isAdmin: false,
    };

    await userRepository.create(expectedArgs);

    spy.restore();

    const result = await userRepository.findByEmail({ email: 'test123@gmail.com' });

    expect(result).to.eql([
      {
        id: 3,
        email: 'test123@gmail.com',
        name: 'test',
        is_admin: 0,
      },
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should be rejected because email is too long', async function() {
    const spy = sinon.spy(userRepository, 'create');
    const expectedArgs = {
      email: 'kdfasfasfsasdflasbhflasd;fldhasfkhaskfhas;lfjh;ljashf;ldhs;fkldashflkhnasvojuwbhergih083qwhg0b9j0eb8ehbv-09d-asb9yhd-asbhj-yhf-ds9hbf-9dfshbf-d9fsyhd-fshb-d9fsbh9-dsbh902qh2qh2qhpvnewbvnaeiwhcvfjaucvfpr-ewhnvgr90aewhbv-[w9rhb-9aewhb v-rhawbv-aw9hb9-rhasw-b9hsb9-h-ashb',
      name: 'DOOMED',
      is_admin: false,
    };

    try {
      await userRepository.create(expectedArgs);
    } catch (err) {
      spy.restore();

      const errorNumber = err.errno;

      expect(errorNumber).to.equal(1406);

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, expectedArgs);
    }
  });

  it('should be rejected because name is too long', async function() {
    const spy = sinon.spy(userRepository, 'create');
    const expectedArgs = {
      email: 'DOOMED@doomedmail.com',
      name: 'kdfasfasfsasdflasbhflasd;fldhasfkhaskfhas;lfjh;ljashf;ldhs;fkldashflkhnasvojuwbhergih083qwhg0b9j0eb8ehbv-09d-asb9yhd-asbhj-yhf-ds9hbf-9dfshbf-d9fsyhd-fshb-d9fsbh9-dsbh902qh2qh2qhpvnewbvnaeiwhcvfjaucvfpr-ewhnvgr90aewhbv-[w9rhb-9aewhb v-rhawbv-aw9hb9-rhasw-b9hsb9-h-ashb',
      is_admin: false,
    };

    try {
      await userRepository.create(expectedArgs);
    } catch (err) {
      spy.restore();

      const errorNumber = err.errno;

      expect(errorNumber).to.equal(1406);

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, expectedArgs);
    }
  });
});

describe('updateRole', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should promote a user', async function() {
    const spy = sinon.spy(userRepository, 'updateRole');
    const expectedArgs = {
      id: 1,
      isAdmin: true,
    };

    await userRepository.updateRole(expectedArgs);

    spy.restore();

    const result = await userRepository.findById({ id: 1 });

    expect(result).to.eql([
      {
        id: 1,
        name: 'Cristopher Namchee',
        email: 'haha@gmail.com',
        is_admin: 1,
      },
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should demote a user', async function() {
    const spy = sinon.spy(userRepository, 'updateRole');
    const expectedArgs = {
      id: 2,
      isAdmin: 0,
    };

    await userRepository.updateRole(expectedArgs);

    spy.restore();

    const result = await userRepository.findById({ id: 2 });

    expect(result).to.eql([
      {
        id: 2,
        name: 'Gunawan Christanto',
        email: 'testmail@gmail.com',
        is_admin: 0,
      },
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('shouldn\'t change anything', async function() {
    const spy = sinon.spy(userRepository, 'updateRole');
    const expectedArgs = {
      id: 239,
      isAdmin: false,
    };

    await userRepository.updateRole(expectedArgs);
    
    spy.restore();

    const result = await userRepository.findById({ id: 239 });

    expect(result).to.eql([]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should be rejected because of wrong field value', async function() {
    const spy = sinon.spy(userRepository, 'updateRole');
    const expectedArgs = {
      id: 1,
      isAdmin: 'DOOM',
    };

    try {
      await userRepository.updateRole(expectedArgs);
    } catch (err) {
      spy.restore();

      const errorNumber = err.errno;

      expect(errorNumber).to.equal(1366);

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, expectedArgs);
    }
  });
});

describe('delete', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should delete a user', async function() {
    const spy = sinon.spy(userRepository, 'delete');
    const expectedArgs = {
      id: 1,
    };

    await userRepository.delete(expectedArgs);

    spy.restore();

    const result = await userRepository.findById({ id: 1 });

    expect(result).to.eql([]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('shouldn\'t delete anything', async function() {
    const spy = sinon.spy(userRepository, 'delete');
    const expectedArgs = {
      id: 13,
    };

    await userRepository.delete(expectedArgs);

    spy.restore();

    const result = await userRepository.findAll();

    expect(result).to.eql([
      {
        id: 1,
        name: 'Cristopher Namchee',
        email: 'haha@gmail.com',
        is_admin: 0,
      },
      {
        id: 2,
        name: 'Gunawan Christanto',
        email: 'testmail@gmail.com',
        is_admin: 1,
      },
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

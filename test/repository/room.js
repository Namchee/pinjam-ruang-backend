import chai from 'chai';
import sinon from 'sinon';

import { createConnection } from '../../src/helpers/database';
import { RoomRepository } from '../../src/repository/room';

import { truncate, seed } from './../helpers/repository/room';

const expect = chai.expect;

const roomRepository = RoomRepository(createConnection('dev'));

describe('findAll', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should return 2 rooms', async function() {
    const spy = sinon.spy(roomRepository, 'findAll');
    const result = await roomRepository.findAll();

    expect(result).to.eql([
      {
        id: 1,
        name: '9121',
      },
      {
        id: 2,
        name: '10316',
      },
    ]);

    spy.restore();
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy);
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

  it('should return room 9121', async function() {
    const spy = sinon.spy(roomRepository, 'findByName');
    const expectedArgs = { name: '9121' };

    const result = await roomRepository.findByName(expectedArgs);

    expect(result).to.eql([
      {
        id: 1,
        name: '9121',
      }
    ]);

    spy.restore();
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return empty array', async function() {
    const spy = sinon.spy(roomRepository, 'findByName');
    const expectedArgs = { name: '6969' };

    const result = await roomRepository.findByName(expectedArgs);

    expect(result).to.eql([]);

    spy.restore();
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

describe('findById', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should return room 10316', async function() {
    const spy = sinon.spy(roomRepository, 'findById');
    const expectedArgs = { id: 2 };

    const result = await roomRepository.findById(expectedArgs);

    expect(result).to.eql([
      {
        id: 2,
        name: '10316',
      },
    ]);

    spy.restore();
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return an empty array', async function() {
    const spy = sinon.spy(roomRepository, 'findById');
    const expectedArgs = { id: 1000 };

    const result = await roomRepository.findById(expectedArgs);

    expect(result).to.eql([]);

    spy.restore();
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

  it('should return true because it exists in database', async function() {
    const spy = sinon.spy(roomRepository, 'exist');
    const expectedArgs = { id: 1 };

    const result = await roomRepository.exist(expectedArgs);
    const processed = result[0].jml > 0;

    expect(processed).to.be.true;

    spy.restore();
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return false because it doesn\'t exist in database', async function() {
    const spy = sinon.spy(roomRepository, 'exist');
    const expectedArgs = { id: 12903 };

    const result = await roomRepository.exist(expectedArgs);
    const processed = result[0].jml > 0;

    expect(processed).to.be.false;

    spy.restore();
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

  it('should insert room 9122', async function() {
    const spy = sinon.spy(roomRepository, 'create');
    const expectedArgs = { name: '9122' };

    await roomRepository.create(expectedArgs);

    spy.restore();

    const result = await roomRepository.findByName({ name: '9122' });

    expect(result).to.eql([
      {
        id: 3,
        name: '9122',
      }
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should be rejected because of duplication', async function() {
    const spy = sinon.spy(roomRepository, 'create');
    const expectedArgs = { name: '10316' };

    try {
      await roomRepository.create(expectedArgs);
    } catch (err) {
      spy.restore();

      const errorNumber = err.errno;

      expect(errorNumber).to.equal(1062);

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, expectedArgs);
    }
  });

  it('should be rejected because name is too long', async function() {
    const spy = sinon.spy(roomRepository, 'create');
    const expectedArgs = { name: 'DOOMED, YOU ARE DOOMED' };

    try {
      await roomRepository.create(expectedArgs);
    } catch (err) {
      spy.restore();

      const errorNumber = err.errno;

      expect(errorNumber).to.equal(1406);

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, expectedArgs);
    }
  });
});

describe('update', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should update room 10316 to 10317', async function() {
    const spy = sinon.spy(roomRepository, 'update');
    const expectedArgs = { id: 2, name: '10317' };

    await roomRepository.update(expectedArgs);

    spy.restore();

    const result = await roomRepository.findById({ id: 2 });

    expect(result).to.eql([
      {
        id: 2,
        name: '10317',
      }
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('shouldn\'t change anything', async function() {
    const spy = sinon.spy(roomRepository, 'update');
    const expectedArgs = { id: 1000, name: 'DOOMED' };

    await roomRepository.update(expectedArgs);

    spy.restore();

    const result = await roomRepository.findAll();

    expect(result).to.eql([
      {
        id: 1,
        name: '9121',
      },
      {
        id: 2,
        name: '10316',
      }
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should be rejected because of duplication', async function() {
    const spy = sinon.spy(roomRepository, 'update');
    const expectedArgs = { id: 1, name: '10316', };

    try {
      await roomRepository.update(expectedArgs);
    } catch (err) {
      spy.restore();

      const errorNumber = err.errno;

      expect(errorNumber).to.equal(1062);

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, expectedArgs);
    }
  });

  it('should be rejected because name is too long', async function() {
    const spy = sinon.spy(roomRepository, 'update');
    const expectedArgs = { id: 1, name: 'HAWHJIFHAIWFHJUIAF' };

    try {
      await roomRepository.update(expectedArgs);
    } catch (err) {
      spy.restore();

      const errorNumber = err.errno;

      expect(errorNumber).to.equal(1406);
      
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

  it('should delete room 9121', async function() {
    const spy = sinon.spy(roomRepository, 'delete');
    const expectedArgs = { id: 1 };

    await roomRepository.delete(expectedArgs);

    spy.restore();

    const result = await roomRepository.findById({ id: 1 });

    expect(result).to.eql([]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('shouldn\'t delete anything', async function() {
    const spy = sinon.spy(roomRepository, 'delete');
    const expectedArgs = { id: 12903 };

    await roomRepository.delete(expectedArgs);

    spy.restore();

    const result = await roomRepository.findAll();

    expect(result).to.eql([
      {
        id: 1,
        name: '9121',
      },
      {
        id: 2,
        name: '10316',
      }
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

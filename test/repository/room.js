import chai from 'chai';
import sinon from 'sinon';

import { createConnection } from '../../src/helpers/connection';
import { RoomRepository } from '../../src/repository/room';

import { truncate, seed } from './../helpers/repository/room';

const expect = chai.expect;

const roomRepository = RoomRepository.inject(createConnection('dev'));

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

  it('should return true', async function() {
    const spy = sinon.spy(roomRepository, 'exist');
    const expectedArgs = { id: 1 };

    const result = await roomRepository.exist(expectedArgs);

    expect(result).to.be.true;

    spy.restore();
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return false', async function() {
    const spy = sinon.spy(roomRepository, 'exist');
    const expectedArgs = { id: 12903 };

    const result = await roomRepository.exist(expectedArgs);

    expect(result).to.be.false;

    spy.restore();
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

describe('createRoom', function() {
  beforeEach(function() {
    return truncate();
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should insert room 9120', async function() {
    const spy = sinon.spy(roomRepository, 'createRoom');
    const expectedArgs = { name: '9120' };

    await roomRepository.createRoom(expectedArgs);

    spy.restore();

    const result = await roomRepository.findByName({ name: '9120' });

    expect(result).to.eql([
      {
        id: 1,
        name: '9120',
      }
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  }); 
});

describe('updateRoom', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should update room 10316 to 10317', async function() {
    const spy = sinon.spy(roomRepository, 'updateRoom');
    const expectedArgs = { id: 2, name: '10317' };

    await roomRepository.updateRoom(expectedArgs);

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
    const spy = sinon.spy(roomRepository, 'updateRoom');
    const expectedArgs = { id: 1000, name: '10317' };

    await roomRepository.updateRoom(expectedArgs);

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

describe('deleteRoom', function() {
  this.beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  this.afterEach(function() {
    return truncate() 
      .then(() => seed());
  });

  it('should delete room 9121', async function() {
    const spy = sinon.spy(roomRepository, 'deleteRoom');
    const expectedArgs = { id: 1 };

    await roomRepository.deleteRoom(expectedArgs);

    spy.restore();

    const result = await roomRepository.findById({ id: 1 });

    expect(result).to.eql([]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('shouldn\'t delete anything', async function() {
    const spy = sinon.spy(roomRepository, 'deleteRoom');
    const expectedArgs = { id: 12903 };

    await roomRepository.deleteRoom(expectedArgs);

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

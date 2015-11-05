var app = {i:0, msgs:[], pc:-1};

app.render = function(){
  $('div.output').text(this.i);
  console.log(this);
};
app.user = [];

function addUser(users){
  var u = {id: users.length, msgs:[]};
  users.push(u);
  return users;
}
addUser.reverse = removeUser;

function removeUser(users){
  assert(users.length >0, 'no more users to remove');
  users.pop();
  return users;
}
removeUser.reverse = addUser;

function inc(i){
  return i+1;
}
inc.desc = 'increment by one';
inc.reverse = dec;

function dec(i){
  return i-1;
}
dec.reverse = inc;

function add3(i, user){
  if (user === 1) throw 'not allowed';
  return i+3;
}

function stringifyFunction(f){
  assert (typeof f === 'function');
  return f.toString();
}
function stringifyFunctionMembers(o){
  assert (typeof o === 'object');
  var keys = Object.keys(o);
  var value = null;
  keys.forEach(function(key){
    value = o[key];
    if (typeof value === 'function'){
      o[key] = stringifyFunction(value); //note that this is lossy.
    }
  });
  return o;
}
function evalFunction(str){
  //strip out the contents of the function, then run it through a Function constructor. Return the result.
  //remove everything before the first { and the last }
  var result = str.replace();
}
function evalFunctionMembers(o){
  assert (typeof o === 'object');
  var TOKEN = 'function (';
  var keys = Object.keys(o);
  var value = null;
  keys.forEach(function(key){
    value = o[key];
    if (typeof value === 'string'){
      var f;
      value = 'var f =' + value;
      console.log(value, f);
      eval(value);
      o[key] = f;
    }
  });
  return o;
}

// function observe(observer, observee){
//   assert(typeof observee === 'object');
//   assert(typeof observee.observe === 'function');
//   assert(typeof observee.observers === 'object'); //array
//   assert(observee.observers.indexOf(observer) === -1);
//   observer.observe(observee);
// }

function assert(pred, msg){
  if (!pred) throw 'assert failed' + msg;
}

function back(data, steps){
  assert(data.pc > -1, 'cannot go back beyond -1');
  var msg = data.msgs[data.pc--];
  data[msg.target] = msg.op.reverse(data[msg.target]);
  data.render();
}

function forward(data, steps){
  assert(data.pc < data.msgs.length -1, 'cant go past end');
  var msg = data.msgs[++data.pc];
  data[msg.target] = msg.op(data[msg.target]);
  data.render();
}

function s(op, data, target, user){
  var help = ' s(op, data, target)';
  assert (typeof op === 'function', help + 1);
  assert (typeof data === 'object', help + 2);
  assert (typeof target === 'string', help + 3);
  assert (data.hasOwnProperty(target),help + 4);
  
  assert (typeof data.msgs === 'object', 'data arg must have a msgs member');
  assert (typeof data.render === 'function', 'data arg must have a render function member');
  if (typeof op.reverse !== 'function') console.warn('irreversable function!', op);
  
  var result = op(data[target], user);
  console.log(data[target], result);
  //assert(result, 'every operation should return something, even an empty list');
  data[target] = result;
  data.msgs.push({id:data.msgs.length, op: op, data:data, target:target, user:user});
  data.pc = data.msgs.length -1;
  data.render();
}

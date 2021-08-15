const { connection } = require("../connection/connection");

exports.getLogin = (req, res) => {
  res.render("agent/login");
};

exports.postLogin = (req, res) => {
  // get params ;
  const username = req.body.username;
  const password = req.body.password;
  // console.log(username, password);

  connection.query(
    `select * from login where username = '${username}' and pass_word = '${password}';`,
    (err, rows, fields) => {
      if (!err) {
        if (rows.length > 0) {
          // console.log(rows[0].a_id);
          req.session.user = username;
          req.session.agentId = rows[0].a_id;
          // console.log(req.session);

          res.redirect("/agent");
        } else {
          console.log("wrong username or password");
          res.redirect("/agent/login");
        }
      } else {
        console.log("wrong username or password");
      }
    }
  );
  // perform check on

  // if yes set up an xookies and session
};

exports.getAgenthome = (req, res) => {
  let agentInfo;
  let agentId = req.session.agentId;
  let propertyDetails;
  let property_sold_rented;
  // console.log("session", req.session);
  if(!req.session.agentId){
    res.redirect('/agent/login');
  }
  connection.query(
    `SELECT * FROM agent WHERE a_id = '${agentId}' ; select * from property WHERE a_id = '${agentId}';
     select p_id,area,locality,current_status from property where (current_status = "sold" or current_status = "rented") and a_id = ${agentId}  ; `,
    (err, rows, fields) => {
      console.log(rows);
      agentInfo = rows[0];
      console.log(agentInfo[0]);
      propertyDetails = rows[1];
      console.log("agentinfo d", agentInfo);
     
      property_sold_rented = rows[2];
      console.log(property_sold_rented);
      
      res.render("agent/agentHome", {
        info: agentInfo,
        pDetails: propertyDetails,
        sold_rented : property_sold_rented
      });
    }
  );
};


exports.getAddProperty = (req,res) => {
    const agentId = req.params.agentId;
    if(req.session.agentId == agentId) {
        console.log(agentId);
        res.render('agent/add_property',{
            id : agentId
        });
    }else{
        res.redirect('/')
    }
   
}

exports.postAddProperty = (req,res) => {
    let { area,bhk,price,asked_price,city,locality,type,status,owner_id,agentId } = req.body;
    const propertyId = Math.floor(Math.random()*88000 +11000);
    area = +area;
    bhk = +bhk;
    price = +price;
    asked_price = +asked_price;
    owner_id = +owner_id;
    agentId = +agentId;
    // console.log('working')
    // console.log(req.body)
    console.log('status',status,type)
    console.log(propertyId)
     const query = `insert into property (p_id , area , bhk ,asked_price , locality ,city , rent_sell ,current_status , owner_id , a_id , price ) values
     ( ${propertyId} , '${area}' , '${bhk}' , '${asked_price}' ,'${locality}'  ,'${city}' ,'${type}' , '${status}' ,'${owner_id}' , '${agentId}' ,'${price}');`
     connection.query(query,(err,rows,field,) => {
       if(!err){
          res.redirect('/agent');
       }else{
         console.log(err);
       }
     })
}

exports.postUpdateProperty = (req,res) => {
  const propertyId = req.params.propertyId;
  const agentId = req.session.agentId;
  const { status } = req.body
  if(!agentId){
    res.redirect('/agent/login');
    return;
  }
  const query = `update property set current_status='${status}' where p_id='${propertyId}';`
  connection.query(query,(err,rows,field) => {
    if(!err){
      res.redirect('/agent')
    }else{
      console.log(err);
    }
  })

  console.log(propertyId, agentId, status);
}

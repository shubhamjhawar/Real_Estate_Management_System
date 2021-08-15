const { connection } = require('../connection/connection');

exports.getLogin = (req,res) => {
    res.render('office/login')
}


exports.postLogin = (req, res) => {
    // get params ;
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);
    
    connection.query(
      `select * from login where username = '${username}' and pass_word = '${password}' and is_admin=1;`,
      (err, rows, fields) => {
        if (!err) {
          if (rows.length > 0) {
            console.log(rows[0].a_id);
            req.session.user = username;
            req.session.officeId = rows[0].a_id;
            console.log(req.session);
            res.redirect("/office");
          } else {
            console.log("wrong username or password");
            res.redirect("/office/login");
          }
        } else {
          console.log("wrong username or password");
        }
      }
    );
   
  };
 


exports.getOfficeHome = (req,res) => {

    if(!req.session.officeId){
        res.redirect('/office/login');
        return;
    }

    const query1 = `select a_id,firstname,lastname from agent; select count(p_id) total_count from property; select count(trans_id) total_count from buyers_history; select count(p_id) total_count from property where current_status = 'rented';`
    connection.query(query1,(err,rows,fields) => {
        const agents = rows[0];
        const countp = rows[1];
        const counts = rows[2];
        const countr = rows[3]
        // console.log('rows',rows);
        
            res.render('office/officeHome',{
                agentdata : agents,
                countp : countp,
                counts : counts,
                countr : countr
            })
    });
}

exports.getAgentProfile = (req,res) => {
  if(!req.session.officeId){
    res.redirect('/office/login');
    return;
  }
    const agentId = req.params.agentId;
    const query = `select * from agent where a_id = '${agentId}'; select * from property where a_id = '${agentId}'; select count(a_id) total_count from property where a_id = '${agentId}'; 
    select * from property where a_id = '${agentId}' and current_status='sold';  select count(a_id) total_count from property where a_id = ${agentId} and current_status='sold';  
    select * from property where a_id = '${agentId}' and current_status='rented'; select count(a_id) total_count from property where a_id = ${agentId} and current_status='rented';`
    console.log(agentId);
    if(!req.session.officeId){
        res.redirect('/office/login');
        return;
    }

    connection.query(query,(err,rows,fields) => {
        if(!err){
        const agentProfile = rows[0];
        const propertyDetails = rows[1]
        const countProperty = rows[2]
        const sold = rows[3]
        const csold = rows[4]
        const rented = rows[5]
        const crented = rows[6]
        console.log(rows)
        res.render('office/profile',{
            profile : agentProfile,
            pdetails : propertyDetails,
            cproperty : countProperty,
            solds : sold,
            csold : csold,
            rented : rented,
            crented : crented

        });
        }else{
            cosnole.log(err);
        } 
    })
}

exports.getAddAgent = (req, res) => {
  if(!req.session.officeId){
    res.redirect('/office/login');
    return;
  }
  res.render('office/add_agent')

}

exports.postAddAgent = (req, res) => {
  if(!req.session.officeId){
    res.redirect('/office/login');
    return;
  }
  let { firstname,lastname,contact,username,password } = req.body;
  contact = +contact;

  const id = Math.floor(Math.random()*200 + 11);
  console.log(req.body,id);
  const query = `insert into agent (a_id , firstname , lastname , is_admin , contact ) values
  ( '${id}' , '${firstname}' , '${lastname}' , 0 , '${contact}');  
   insert into login (username , pass_word , a_id , is_admin ) values
  ('${username}','${password}','${id}', 0);  `;
  connection.query(query,(err,rows,field) => {
    if(!err){
      res.redirect('/office')
    }else{
      console.log(err);
    }
    
  })
}

exports.getAddProperty = (req, res) => {

  if(!req.session.officeId){
    res.redirect('/office/login');
    return;
  }
  
  res.render('office/add_property');
}

exports.postAddProperty = (req, res) => {
  if(!req.session.officeId){
    res.redirect('/office/login')
    return;
  }
  const id = Math.floor(Math.random()*90000 + 100000);
  let { area,bhk,price,asked_price,city,locality,type,status,owner_id,agent_id } = req.body;
  area = +area;
  bhk = +bhk;price = +price;
  asked_price = +asked_price;
  owner_id = +owner_id;
  agent_id = +agent_id;

  const query = `insert into property (p_id , area , bhk ,asked_price , locality ,city , rent_sell ,current_status , owner_id , a_id , price ) values
  ( '${id}' , '${area}' , '${bhk}' , '${asked_price}' , '${locality}' ,'${city}' ,'${type}' , '${status}' ,'${owner_id}' ,'${agent_id}' ,'${price}');`

  connection.query(query,(err,rows,field)=> {
    if(!err){
      res.redirect('/office');
    }else{
      console.log(err);
    }
  })
  // console.log(req.body);

}

exports.getTotalProperties = (req, res) => {
  if(!req.session.officeId){
    res.redirect('/office/login');
    return
  }
  const query = `select count(p_id) total_count from property; select * from property;`
  connection.query(query,(err,rows,fields) => {
    const countp = rows[0];
    const pdetails = rows[1];
    res.render('office/total_properties',{
      countp : countp,
      pDetails : pdetails
    })
  })
  
}

exports.getTotalSoldProperties = (req, res) => {
  if(!req.session.officeId){
    res.redirect('/office/login');
    return
  }

  const query = `select count(trans_id) total_count from buyers_history; select * from property where current_status = 'sold';`
  connection.query(query,(err,rows,fields) => {
    const counts =  rows[0];
    const soldDetails  = rows[1];
    res.render('office/sold_properties',{
      counts : counts,
      soldDetails : soldDetails
    })

  })
 
}

exports.getTotalRentedProperties = (req, res) => {
  if(!req.session.officeId){
    res.redirect('/office/login');
    return
  }
  const query = `select count(p_id) total_count from property where current_status = 'rented'; select * from property where current_status = 'rented';`
  connection.query(query,(err,rows,fields) => {
    const rentedp = rows[0];
    const rentedDetails = rows[1]
    res.render('office/rented_properties',{
      rentedp : rentedp,
      rentedDetails : rentedDetails
    })
  })
 
}
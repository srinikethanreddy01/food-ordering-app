const express = require("express")
const cors = require('cors');
const mongoose = require("mongoose")
const Customer = require("./models/customer")
const { v4: uuidv4 } = require('uuid');
const app = express();
const Order = require("./models/Order");
const Restaurant = require("./models/Restaurant");
const FoodItem = require("./models/FoodItem");
const Cart=require("./models/Cart")
// const { default: Orders } = require("../client/src/pages/Orders");


app.use(express.json());
app.use(cors());
// app.get('/',(req,res)=>{
//     res.send("hello world")
// })

mongoose.connect('mongodb://127.0.0.1:27017/Customer', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});


app.get('/', (req, res) => {
    // const re=customer.find({});
    // console.log(re);
})
app.post('/addorder/:id', async (req, res) => {
    const customerId = req.params.id;
    const foodItemId = '60d21b4667d0d8992e610c86';
    
    try {
        const user = await Customer.findById('66d3f56753623387a919a4bf');
        console.log(user);

        const newOrder = new Order({
            customer: customerId,
            items: [{
                foodItem: foodItemId,
                quantity: 2
            }],
            status: 'Pending',
            deliveryAddress: {
                address: '123 Main St',
                city: 'Springfield',
                state: 'IL',
                zip: '62701'
            }
        });

        const order = await newOrder.save();
        console.log('New Order Created:', order);
        res.status(201).send(order);
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).send({ error: 'Error creating order' });
    }
});

app.get('/cart/:userid',async(req,res)=>{

    const userid=req.params.userid;
    try{
        const data=await Cart.find({customer:userid});
        res.status(201).send({data:data})
    }
    catch(err){
        res.status(500).send({message:err})
    }
})

app.post('/signin', async (req, res) => {
    try {
        const data = req.body;
        data.uniqueId = uuidv4();
        // console.log(data)

        const customer = new Customer(data);
        await customer.save();
        res.status(201).send({ message: 'Customer created successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Error creating customer' });
    }

})

app.get('/getRestaurants', async (req, res) => {
    try {
        const data=await Restaurant.find({})
        // console.log(data);
        res.status(201).send(data);

       
    } catch (error) {
        console.error('Error fetching restaurant details:', error);
        res.status(500).send({ error: 'Error fetching restaurant details' });
    }
});

app.get('/getOrders/:id', async (req, res) => {
    const id = req.params.id;
    console.log('Customer ID:', id);

    try {
        const data = await Order.find({ customer: id });  
        console.log('Fetched Orders:', data);

        res.status(200).send({ data: data });  
    } catch (error) {  
        console.error('Error fetching orders:', error);
        res.status(500).send({ error: 'Error fetching orders' });  
    }
});




app.post('/removeFromCart', async (req, res) => {
    const { userid, foodid } = req.body;
    console.log(userid+" "+foodid)
    try {

        const cart = await Cart.findOne({ customer: userid });

        if (!cart) {
            throw new Error('Cart not found for the specified user');
        }


        cart.cart = cart.cart.filter(item => !item.equals(foodid));

      
        await cart.save();
        console.log('updated')

        res.status(201).send({message:'Updated the cart'})
   
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
});

app.post('/completeOrder', async (req, res) => {
    const { customer, items, totalAmount, deliveryAddress } = req.body;
    console.log(customer)
    
  
    if (!customer || !items || !Array.isArray(items) || items.length === 0 || !deliveryAddress) {
      return res.status(400).send({ error: 'Invalid order data' });
    }
  
    try {
      const newOrder = new Order({
        customer: customer,
        items: items.map(item => ({
          foodItem: item.foodId,
          quantity: item.quantity
        })),
        totalAmount: totalAmount,
        deliveryAddress: deliveryAddress
      });
  
      const savedOrder = await newOrder.save();
      res.status(201).send({ message: 'Order completed successfully', order: savedOrder });
    } catch (err) {
      console.error('Error completing order:', err);
      res.status(500).send({ error: 'Error completing order' });
    }
  });
app.get('/getMenu/:id',async(req,res)=>{
    console.log("ello")

    const id=req.params.id;
    console.log(id);

    try{

        const data=await FoodItem.find({$or:[{restaurant:id},{_id:id}]});
        res.status(200).send(data);



    }
    catch(err){

        res.status(500).send({error:"Error fetching details"})

    }

})


app.post('/addtoCart/:userid/:foodid',async(req,res)=>{
    const userid=req.params.userid;
    const foodid=req.params.foodid;

    try{
    
        let cart = await Cart.findOne({ customer: userid });
        console.log(cart)

        if (cart) {
            
            if (!cart.cart.includes(foodid)) {
                cart.cart.push(foodid);

                await cart.save(); 
               
                return { success: true, message: 'Item added to existing cart.' };
            } else {
                return { success: false, message: 'Item already in cart.' };
            }
        } else {
            // Cart does not exist, create a new one
            cart = new Cart({
                customer: userid,
                cart: [foodid]
            });
            console.log("yes")
            await cart.save(); // Save the new cart
            return { success: true, message: 'New cart created and item added.' };
        }



    }
    catch(err){
        res.status(500).send({error:err});
    }


})
app.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        const customer = await Customer.findOne({ email: email });

        if (!customer) {

            return res.status(404).json({ message: 'User not found' });
        }

        if (customer.password !== password) {

            return res.status(401).json({ message: 'Invalid password' });
        }


        res.status(200).json({ message: 'Login successful', user: customer });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.listen(5000, () => {
    console.log("Server is activated");
})
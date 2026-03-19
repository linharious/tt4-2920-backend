linhttn14_db_user
@mongo2026

mongodb+srv://linhttn14_db_user:@mongo2026@cluster0.b1mxzxz.mongodb.net/?appName=Cluster0

test routes
app.get("/", (req, res) => {
console.log(req);
// res.send("<h1>some html</h1>");
// everytime needs to return sth to get out of this function callback
return res.json({
message: "endpoint home is working!",
});
});

app.post("/test", (req, res) => {
return res.json({
message: "endpoint home is working!",
data: {
ok: true,
age: 99,
},
});
});

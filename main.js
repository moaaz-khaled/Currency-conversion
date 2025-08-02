
lastFetchDate = localStorage.getItem("LastFetchDate") || [];
let today = new Date().toISOString().split("T")[0];

if(!localStorage.getItem("Coins") || lastFetchDate !== today) {
    fetch("https://v6.exchangerate-api.com/v6/66467d90416e2f303f1cf011/latest/USD").then((result) =>{
        let MyData = result.json();
        return MyData;
    }).then((MyData)=>{
        localStorage.setItem("Coins" , JSON.stringify(MyData));
        localStorage.setItem("LastFetchDate" , today);
    })
}

/*
    Because i Have a Monthly Request Limit <only 1500 Request>
    I Depend on LocalStorage Daily For Each User To Avoid Refresh Refresh Refresh .....
    <In other words> =>  each user works with exchange rates that are fetched once at 00:00 
                        and remain the same throughout the entire day.

    The Best State is Depend on Cached Memory <DataBase> and Fetch Data from DB => Restful API instead of 
    Third-party_API directly To improve Performance and Fetch Data from Third-party_API  more Than One In a Day
*/


let MyData = JSON.parse(localStorage.getItem("Coins"));

let ExchangeBtn = document.getElementById("ExchangeBtn");

ExchangeBtn.onclick = function() {
    let from = document.getElementById("ExchangeFrom").value;
    let to = document.getElementById("ExchangeTo").value;
    let Amount = parseFloat(document.getElementById("Amount").value);
    if(Amount <= 0 || !Amount) {
        Swal.fire({
            title: "Invalid Input",
            text: "Input Should Be Greater Than 0",
            icon: "error"
        });
    }
    else {
        let Result = convert(MyData.conversion_rates[from] , MyData.conversion_rates[to] , Amount);
        document.getElementById("Result").innerText = SignofCoin(to) + " " + Result.toFixed(3);
    }

}  // I set id of Each <option> to match key name of Json Data That Come from API


function convert(fromRate, toRate, amount) {
    return (toRate / fromRate) * amount;
}

function SignofCoin(ExchangeTo) {
    let Sign = "";
    if(ExchangeTo === "USD")
        Sign ="$";
    else if(ExchangeTo === "EUR")
        Sign = "Є";
    else if(ExchangeTo === "GBP")
        Sign ="£";
    else if(ExchangeTo === "JPY")
        Sign ="¥";
    else if(ExchangeTo === "EGP")
        Sign ="E£";
    return Sign;
}
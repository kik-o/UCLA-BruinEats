const express = require('express');
const app = express();
const router = express.Router();
const moment = require('moment');
const OverviewMenu = require('../../../db').OverviewMenu;
const DetailedMenu = require('../../../db').DetailedMenu;
const ActLevel = require('../../../db').ActLevel;
const Hours = require('../../../db').Hours;
const Recipe = require('../../../db').Recipe;

const path = require("path");

router.use(express.static(__dirname + '/public'));

router.get('/nutritionfacts', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/nutritionfacts.html'));
});

// to query nutrition, for recipe link like http://menu.dining.ucla.edu/Recipes/075000/1,
// extract 075000/1 and then do /nutrition?recipe_link=075000/1
router.get('/nutrition', (req, res) => {
    Recipe.findAllByRecipeLink(req.query.recipe_link).then(returned_recipes => {
        if (returned_recipes.length >= 1) {
            var recipes = [];
            var target_recipe = returned_recipes[returned_recipes.length-1].getNutrition();
            recipes.push({nutrition: target_recipe});

            res.json({recipes});    
        }
        else {
            var recipes = returned_recipes;
            res.json({recipes});
        }
    });
});

// to query nutrition and nutrition box, for recipe link like http://menu.dining.ucla.edu/Recipes/075000/1,
// extract 075000/1 and then do /nutritionbox?recipe_link=075000/1
router.get('/nutritionbox', (req, res) => {
    Recipe.findAllByRecipeLink(req.query.recipe_link).then(recipes => {
        if (recipes.length >= 1) {
            var nutrition= recipes[0].getNutrition();
            if (Object.keys(nutrition).length == 0) {
                res.render("not_found");
            }
            else {
                var context = {};
                populate_context(nutrition,context);
                res.render("nutritionbox",context);
            }
        }
        else
            res.render("not_found");
    })
});

// Get overview menu from today til the next 7 days
router.get('/OverviewMenu', (req, res) => {
    let startDate = moment().format("YYYY-MM-DD");
    let endDate = moment().add(6, 'days').format("YYYY-MM-DD");
    OverviewMenu.findAllByDateRange(startDate,endDate).then(returned_menus => {
        var menus = [];
        
        returned_menus.forEach(function(element) {
            var overview_menu = element.getOverviewMenu();
            var menu_date = element.getMenuDate();
            menus.push({ menuDate: menu_date, overviewMenu: overview_menu });
        });

        res.json({ menus });
    });
});

router.get('/DetailedMenu', (req, res) => {
    let startDate = moment().startOf('day').toDate();
    let endDate = moment().startOf('day').add(6, 'days').toDate();
    DetailedMenu.findAllByDateRange(startDate,endDate).then(returned_menus => {
        var menus = [];
        
        returned_menus.forEach(function(element) {
            var detailed_menu = element.getDetailedMenu();
            var menu_date = element.getMenuDate();
            menus.push({ menuDate: menu_date, detailedMenu: detailed_menu });
        });

        res.json({ menus });
    });
});

router.get('/ActivityLevels', (req, res) => {
    ActLevel.findLast().then(levels => {
        if (levels.length > 0) {
            var level = levels[levels.length-1].getActivityLevel();
            res.json({ level });
        }
        else  {
            var level = levels;
            res.json({level});
        }
    });
});

router.get('/Hours', (req, res) => {
    let startDate = moment().startOf('day').toDate();
    let endDate = moment().startOf('day').add(6, 'days').toDate();

    Hours.findByAllDateRange(startDate,endDate).then(returned_hours => {
        var hours = [];
        
        returned_hours.forEach(function(element) {
            var dining_hours = element.getHours();
            var hour_date = element.getHourDate();
            hours.push({ hourDate: hour_date, hours: dining_hours });
        });

        res.json({ hours });
    });
});

// Test functions, for functionality
router.get('/test', (req, res) => {
    // let json_obj = {
    //     "test1": "Hello World",
    //     "test2": "Hi",
    // };
    // let date = moment().add(7, 'days').format("YYYY-MM-DD");
    // OverviewMenu.create({overviewMenu: json_obj, menuDate:date}).then(new_menu => {
    //     console.log(new_menu.getOverviewMenu());
    // });
    // let predate = moment().subtract(1,'hours');
    // OverviewMenu.findAllByDateRange(predate.toDate(), moment().toDate()).then(menus => {
    //     console.log(menus);
    // });
    OverviewMenu.findByID(1).then(new_menu => {
        console.log(new_menu.getOverviewMenu());
    });
});

function populate_context(nutrition, context) {
    var nutrition_keys = Object.keys(nutrition);

    if(nutrition_keys.indexOf("serving_size" ) != -1)
        context["serving_size"] = nutrition["serving_size"];
    else
        context["serving_size"] = "--";
    
    if(nutrition_keys.indexOf("Calories") != -1)
        context["Calories"] = nutrition["Calories"];
    else
        context["Calories"] = "--";

    if(nutrition_keys.indexOf("Fat_Cal.") != -1)
        context["Fat_Cal"] = nutrition["Fat_Cal."];
    else
        context["Fat_Cal"] = "--";

    if(nutrition_keys.indexOf("Total_Fat") != -1) {
        context["Total_Fat_g"] = (nutrition["Total_Fat"][0][0] == "-" ? "--" : nutrition["Total_Fat"][0]);
        context["Total_Fat_p"] = (nutrition["Total_Fat"][1][0] == "-" ? "--" : nutrition["Total_Fat"][1]);
    }
    else {
        context["Total_Fat_g"] = "--";
        context["Total_Fat_p"] = "--";
    }

    if(nutrition_keys.indexOf("Saturated_Fat") != -1) {
        context["Saturated_Fat_g"] = (nutrition["Saturated_Fat"][0][0] == "-" ? "--" : nutrition["Saturated_Fat"][0]);
        context["Saturated_Fat_p"] = (nutrition["Saturated_Fat"][1][0] == "-" ? "--" : nutrition["Saturated_Fat"][1]);
    }
    else {
        context["Saturated_Fat_g"] = "--";
        context["Saturated_Fat_p"] = "--";
    }

    if(nutrition_keys.indexOf("Trans_Fat") != -1) {
        context["Trans_Fat_g"] = (nutrition["Trans_Fat"][0][0] == "-" ? "--" : nutrition["Trans_Fat"][0]);
    }
    else {
        context["Trans_Fat_g"] = "--";
    }

    if(nutrition_keys.indexOf("Cholesterol") != -1) {
        context["Cholesterol_g"] = (nutrition["Cholesterol"][0][0] == "-" ? "--" : nutrition["Cholesterol"][0]);
        context["Cholesterol_p"] = (nutrition["Cholesterol"][1][0] == "-" ? "--" : nutrition["Cholesterol"][1]);
    }
    else {
        context["Cholesterol_g"] = "--";
        context["Cholesterol_p"] = "--";
    }

    if(nutrition_keys.indexOf("Sodium") != -1) {
        context["Sodium_g"] = (nutrition["Sodium"][0][0] == "-" ? "--" : nutrition["Sodium"][0]);
        context["Sodium_p"] = (nutrition["Sodium"][1][0] == "-" ? "--" : nutrition["Sodium"][1]);
    }
    else {
        context["Sodium_g"] = "--";
        context["Sodium_p"] = "--";
    }

    if(nutrition_keys.indexOf("Total_Carbohydrate") != -1) {
        context["Total_Carbohydrate_g"] = (nutrition["Total_Carbohydrate"][0][0] == "-" ? "--" : nutrition["Total_Carbohydrate"][0]);
        context["Total_Carbohydrate_p"] = (nutrition["Total_Carbohydrate"][1][0] == "-" ? "--" : nutrition["Total_Carbohydrate"][1]);
    }
    else {
        context["Total_Carbohydrate_g"] = "--";
        context["Total_Carbohydrate_p"] = "--";
    }

    if(nutrition_keys.indexOf("Dietary_Fiber") != -1) {
        context["Dietary_Fiber_g"] = (nutrition["Dietary_Fiber"][0][0] == "-" ? "--" : nutrition["Dietary_Fiber"][0]);
        context["Dietary_Fiber_p"] = (nutrition["Dietary_Fiber"][1][0] == "-" ? "--" : nutrition["Dietary_Fiber"][1]);
    }
    else {
        context["Dietary_Fiber_g"] = "--";
        context["Dietary_Fiber_p"] = "--";
    }

    if(nutrition_keys.indexOf("Sugars") != -1) {
        context["Sugars_g"] = (nutrition["Sugars"][0][0] == "-" ? "--" : nutrition["Sugars"][0]);
    }
    else {
        context["Sugars_g"] = "--";
    }

    if(nutrition_keys.indexOf("Protein") != -1) {
        context["Protein_g"] = (nutrition["Protein"][0][0] == "-" ? "--" : nutrition["Protein"][0]);
    }
    else {
        context["Protein_g"] = "--";
    }

    if(nutrition_keys.indexOf("Vitamin A") != -1)
        context["VA_p"] = (nutrition["Vitamin A"][0] == "-" ? "--" : nutrition["Vitamin A"]);
    else
        context["VA_p"] = "--";

    if(nutrition_keys.indexOf("Vitamin C") != -1)
        context["VC_p"] = (nutrition["Vitamin C"][0] == "-" ? "--" : nutrition["Vitamin C"]);
    else
        context["VC_p"] = "--";

    if(nutrition_keys.indexOf("Calcium") != -1)
        context["Cal_p"] = (nutrition["Calcium"][0] == "-" ? "--" : nutrition["Calcium"]);
    else
        context["Cal_p"] = "--";

    if(nutrition_keys.indexOf("Iron") != -1)
        context["Iron_p"] = (nutrition["Iron"][0] == "-" ? "--" : nutrition["Iron"]);
    else
        context["Iron_p"] = "--";

    if(nutrition_keys.indexOf("ingredients") != -1)
        context["ingredients"] = nutrition["ingredients"].trim();
    else
        context["ingredients"] = "--";

    if(nutrition_keys.indexOf("allergens") != -1 && nutrition["allergens"].trim().length != 0) {
        console.log("here");
        context["allergens"] = nutrition["allergens"].trim();
    }
    else
        context["allergens"] = "--";

}

module.exports = { router };

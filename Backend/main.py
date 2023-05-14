from fastapi import FastAPI, Path
# from typing import Optional
from fastapi import FastAPI, Path, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
# import pickle
# import numpy as np
# import pandas as pd
# from create_prediction_point import createPredictionPoint
import mysql.connector 
import json


app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.on_event("startup")
async def startup_event():
    app.state.mydb = mysql.connector.connect(
    host="cloud.mindsdb.com",
    user="abcdefghijklmnopqrst1020@gmail.com",
    password="J10T20a-t",
    port="3306"
    )

@app.post('/get-answer')
async def get_answer(request:Request):
    mydb= app.state.mydb
    if request:
        params = await request.json()
        car = params["car"]
        model = params["model"]
        text= car + " " + model + "model"
        
        cursor = mydb.cursor()
        # text = "rice, oil, chicken, spices, salt, garammasala, curry, butter, water."
        query = f'SELECT response FROM mindsdb.gpt_car WHERE text="{text}"'
        cursor.execute(query)

        for x in cursor:
            response_dict = json.loads(x[0])  # convert to dictionary
            # response_dict['ingredients'] = str(response_dict['ingredients'])
            # response_dict['directions'] = str(response_dict['directions'])
        # print(response_dict)
        return response_dict

'''
@ app.get('/get-cars')
async def getCars():
    data = pd.read_csv("CARS.csv")
    cars = list(set(np.array(data["CAR"]).tolist()))
    return {
        "cars": cars
    }


@ app.post('/get-results')
async def getResults(request: Request):
    if request:
        params = await request.json()
        name = params["car"]
    data = pd.read_csv("CARS.csv")
    if name:

        info = np.array(data.loc[data["CAR"] == name]).tolist()
        response = {"results": info}
        return response
    else:
        raise HTTPException(400, "Error")
    raise HTTPException(400, "Error")


@ app.post('/get-prediction')
async def getPrediction(request: Request):
    if request:
        params = await request.json()
        name = params["car"]
        TYPE = params['TYPE']
        CYL = params["CYL"]
        ENGINEL = params["ENGINE L"]
        FUEL_TANK_L = params["FUEL TANK L"]
        FUEL_TYPE = params["FUEL TANK L"]
    if params:
        predictionPoint = createPredictionPoint(
            CYL, TYPE, ENGINEL, FUEL_TANK_L, FUEL_TYPE)
        model = pickle.load("voting_regressor_model.pkl")
        lp100km = model.predict([predictionPoint])[0]
        info = [[TYPE, CYL, ENGINEL, FUEL_TANK_L, lp100km, FUEL_TYPE, name]]
        response = {"results": info}
        return response

    else:
        raise HTTPException(400, "Error")
    raise HTTPException(400, "Error")
'''
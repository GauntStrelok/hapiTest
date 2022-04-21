swagger

openapi: 3.0.0
info:
  title: HapiTest
  version: 1.0.0
servers:
  - url: http://localhost:3000
paths:
  /fx/updateRates:
    post:
      tags:
        - fx
      summary: Update rates from provider
      responses:
        '200':
          description: Successful response
          content:
            text/plain:
              schema:
                type: string
                example: All data updated
        '500':
          description: Internal server error
          content:
            application/json: {}
  /rates:
    get:
      tags:
        - rates
      summary: Get rates
      responses:
        '200':
          description: Successful response
          content:
            application/json: 
              schema:
              type: array
              items:
                type: object
        '500':
          description: Internal server error
          content:
            application/json: {}
  /rates/setFee:
    post:
      tags:
        - rates
      summary: Set fee percentage
      requestBody:
        content:
          application/json:
            schema:
              type: object
              example:
                base: "EUR"
                to: "BRL"
                fee: 15
      responses:
        '200':
          description: Successful response
          content:
            text/plain:
              schema:
                type: string
                example: Fee updated correctly
        '500':
          description: Internal server error
          content:
            application/json: {}
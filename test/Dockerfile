FROM    node:10
WORKDIR /app/test
COPY    package.json package-lock.json /app/test/
RUN     npm install
COPY    . /app/test
CMD     [ "npm", "test" ]
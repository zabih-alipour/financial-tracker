package com.alipour.product.financialtracker.utils;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import lombok.extern.slf4j.Slf4j;

import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import java.io.*;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.Arrays;

@Slf4j
public class ArzSocket {
    SSLSocket socket;
    OutputStream out;
    ObjectMapper mapper = new ObjectMapper();

    public Boolean connect() throws IOException {

        SSLSocketFactory socketFactory = (SSLSocketFactory) SSLSocketFactory.getDefault();
        socket = (SSLSocket) socketFactory.createSocket();
//        socket.startHandshake();
        socket.connect(new InetSocketAddress("ws.arzdigital.com", 8443));
        log.info(String.valueOf(socket.isConnected()));
        log.info(Arrays.toString(socket.getEnabledProtocols()));
//        log.info(Arrays.toString(socket.get()));

        PrintWriter out = new PrintWriter(
                new BufferedWriter(
                        new OutputStreamWriter(
                                socket.getOutputStream())));

        out.print("{\"action\":\"fiats\",\"key\":1}");
        out.flush();

        /*
         * Make sure there were no surprises
         */
        if (out.checkError())
            System.out.println(
                    "SSLSocketClient:  java.io.PrintWriter error");

        /* read response */
        BufferedReader in = new BufferedReader(
                new InputStreamReader(
                        socket.getInputStream()));

        String inputLine;
        while ((inputLine = in.readLine()) != null)
            System.out.println(inputLine);

        in.close();
        out.close();
        socket.close();
        return out != null;
    }

    public void send() throws IOException {
        out.write("{\"action\":\"fiats\",\"key\":1}".getBytes());
        out.flush();
        InputStream inputStream = socket.getInputStream();
        if (inputStream.read() != -1) {
//            new String(inputStream.)
        }


    }
}

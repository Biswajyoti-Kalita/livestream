const { verifyToken } = require("./src/services/firebaseService");

const { OAuth2Client } = require('google-auth-library');


// const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImE0MzRmMzFkN2Y3NWRiN2QyZjQ0YjgxZDg1MjMwZWQxN2ZlNTk3MzciLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQmlzd2FqeW90aSBLYWxpdGEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSlpoX3k0TVdwZjR2UmZZaUoxc1VEWVNtVllmd3RFOWpyY1dVclBEY3ctRFE5OVFvSTQ9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcG93ZXJwbGF5LWE5MTBlIiwiYXVkIjoicG93ZXJwbGF5LWE5MTBlIiwiYXV0aF90aW1lIjoxNzM4Njg5MTU5LCJ1c2VyX2lkIjoia05nRVVDeTlQb01pSmIwekpGTUxpN1RuczREMyIsInN1YiI6ImtOZ0VVQ3k5UG9NaUpiMHpKRk1MaTdUbnM0RDMiLCJpYXQiOjE3Mzg2ODkxNTksImV4cCI6MTczODY5Mjc1OSwiZW1haWwiOiJiaXN3YWp5b3Rpa2FsaXRhMTQyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTA0Mjc4NTE1ODU5ODg4MzU3NTA2Il0sImVtYWlsIjpbImJpc3dhanlvdGlrYWxpdGExNDJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.mlzgA_FX3el4JgIIzlPgWQ44ZmdEkBCljZ6aSR8WOYEO02FquFzFqbWc19Z74aFlSlRSrTuBdTekwV8pqHoIUyvzXvqE5xOtm_RLgCDuVSDTR5KQ7fdTRCC7991wb8zgQc2Vx17vrr-6L5YptMK4K_RAiS2Guixi0bMGgQ5Glqs2mMjzBhFadLIwu-PNFXlgBEcllI0lmGPJ8HS0y81G0qQAAj2eC2KhyasRysQwMAUGhAs4jzYrITODyr8OLPf15dsOI65vSV61jjh9vrg2Odp1OxmaJYYh5UFSPfJYl8HuDpwgSPon0E-_116XbaT_IVQok8CFbrAdGc-HruAHCg";
//const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImE0MzRmMzFkN2Y3NWRiN2QyZjQ0YjgxZDg1MjMwZWQxN2ZlNTk3MzciLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQmlzd2FqeW90aSBLYWxpdGEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSlpoX3k0TVdwZjR2UmZZaUoxc1VEWVNtVllmd3RFOWpyY1dVclBEY3ctRFE5OVFvSTQ9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcG93ZXJwbGF5LWE5MTBlIiwiYXVkIjoicG93ZXJwbGF5LWE5MTBlIiwiYXV0aF90aW1lIjoxNzM4NjkwMTI1LCJ1c2VyX2lkIjoia05nRVVDeTlQb01pSmIwekpGTUxpN1RuczREMyIsInN1YiI6ImtOZ0VVQ3k5UG9NaUpiMHpKRk1MaTdUbnM0RDMiLCJpYXQiOjE3Mzg2OTAxMjUsImV4cCI6MTczODY5MzcyNSwiZW1haWwiOiJiaXN3YWp5b3Rpa2FsaXRhMTQyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTA0Mjc4NTE1ODU5ODg4MzU3NTA2Il0sImVtYWlsIjpbImJpc3dhanlvdGlrYWxpdGExNDJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.Zcg7w7oWr-DqtGcTr55ivBmDu3abjeK8Wz3XqRaW8NRDfPvUwq1Ga56IGNwSYUP8e4ymWgYoZ4fmHOMjgDzEXmeaYDeKAgsVp50W6YC7MTlF8KKwwPuxX5auZPq4joapSzYNsix1rFQ-hYt6NUnbE9XegSb1i6GrTPZ80WSAzkr1vj33L1rqQDHzcoAgKCvl_0Mffzhrp2ca4WkM4lqu3ko5WJnLXRVgqjonxtRNF8V_7WqWfCqSMMhwmLxw_23gKZ8U_pK3L1KO7mIlVWj0HoHRaRHAmxJr8vpr93S-dB7Vv0SHSxWLU7W6ibBkki49bkbh2Pk3_z6qLlrHp1GfYQ";
// const token = `eyJhbGciOiJSUzI1NiIsImtpZCI6IjhkMjUwZDIyYTkzODVmYzQ4NDJhYTU2YWJhZjUzZmU5NDcxNmVjNTQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQmlzd2FqeW90aSBLYWxpdGEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSlpoX3k0TVdwZjR2UmZZaUoxc1VEWVNtVllmd3RFOWpyY1dVclBEY3ctRFE5OVFvSTQ9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcG93ZXJwbGF5LWE5MTBlIiwiYXVkIjoicG93ZXJwbGF5LWE5MTBlIiwiYXV0aF90aW1lIjoxNzM5MTI4MTc1LCJ1c2VyX2lkIjoia05nRVVDeTlQb01pSmIwekpGTUxpN1RuczREMyIsInN1YiI6ImtOZ0VVQ3k5UG9NaUpiMHpKRk1MaTdUbnM0RDMiLCJpYXQiOjE3MzkxMjgxNzUsImV4cCI6MTczOTEzMTc3NSwiZW1haWwiOiJiaXN3YWp5b3Rpa2FsaXRhMTQyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTA0Mjc4NTE1ODU5ODg4MzU3NTA2Il0sImVtYWlsIjpbImJpc3dhanlvdGlrYWxpdGExNDJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.DM5_vkemBOkbqCovVG905u43-wcEjL2XRc6HirVth2llYhyy8zCkEC4rfbPQqfbv_lzBUO5wI8RHBWMC1SO41l_BesmQ0QHTjwxKQvmPhuq2lGAi5ThdzAPsFs_qfeyGPKjPDafI53wI13AG5y6d7uz20i2La5lEobBnuLgZ0iwz8Rz09zFRGRMxIGLJXVSM7ud5SNGeNgJIq7T_VnuIxSA56udkHl6Cw_YKMiho60VjAN3tfp4WnkA4JEagAejM9ECTxAXJNTX4_sSgLGAaDNnSJ0Up2oWFBQ-m2_81ExedXnuYcB72v4kWTQL3tOUZsqDTE749zCNKbxkbZRkBpA`;
const token =  'eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlYzUzNGZhNWI4Y2FjYTIwMWNhOGQwZmY5NmI1NGM1NjIyMTBkMWUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMDk0NTg2MjI3MzAwLXAycDZ2dm02aGpxcG9tcjgzM2gwNHIzMmFmcDhpOWowLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTA5NDU4NjIyNzMwMC00amZjbmxndHZ2MG83OXBia2g2YjZlM3E4bXNvajhuai5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwNDI3ODUxNTg1OTg4ODM1NzUwNiIsImVtYWlsIjoiYmlzd2FqeW90aWthbGl0YTE0MkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkJpc3dhanlvdGkgS2FsaXRhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0paaF95NE1XcGY0dlJmWWlKMXNVRFlTbVZZZnd0RTlqcmNXVXJQRGN3LURROTlRb0k0PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkJpc3dhanlvdGkiLCJmYW1pbHlfbmFtZSI6IkthbGl0YSIsImlhdCI6MTczOTE5OTE3NywiZXhwIjoxNzM5MjAyNzc3fQ.ZVWTE-NLwarxTkFsN5o0GKXA_ZAFZgF0Hl0pC0SP8jmO4DwnEfio5miQ9mUwqcjuVzW8iQptS1xgjmxBSpifO1cb_uYpHKRZ7Y_Fe42oLhE8aT0jHT4k8tiJxkVvsYrpQPkA7qDatPgj_s2soxwCTKHzrGc8IiTqXaz518J0n7qxtgom4pG2i7eVozzIlpwzurOyiiZEqrLrnauvEwEyID5i8ZupDXvXl-EsY8uOXBhGUtLj4ERU6N3F1NA-TELkmv-254EXV7H5zishhzcGz3T4HUTaJuWgd_IVnInyTP-En0ob_I0jLw_77p2aNhAVBH_J-LwTzea73iZcx-wX6w';

const CLIENT_ID = '1094586227300-4jfcnlgtvv0o79pbkh6b6e3q8msoj8nj.apps.googleusercontent.com'; // From your Google Cloud Console
const client = new OAuth2Client(CLIENT_ID);

(async () => {
    try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        const userid = payload['sub']; // Use this to identify the user
        // ... further processing ...
    
        // You can access other user information from the payload:
        // payload.email, payload.name, payload.picture, etc.
        console.log({payload})
        return payload; // Return the payload containing user info
      } catch (error) {
        console.error('Error verifying token:', error);
        return null; // Or throw an exception
      }

})();

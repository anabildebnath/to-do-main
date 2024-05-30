import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://qgphiubbfnunppcnpudx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFncGhpdWJiZm51bnBwY25wdWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAxMzc4NDksImV4cCI6MjAwNTcxMzg0OX0.tq0YKntPaAPhUVXA1LePZDwlVren-TJ3OnTs07JSAGM";
const supabaseClient = createClient(supabaseUrl, supabaseKey);

//live server deployment url on render
const baseUrl = "https://to-do-main.onrender.com";

// Event listener for Google login button
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("google-login")
    .addEventListener("click", async () => {
      try {
        const { error } = await supabaseClient.auth.signInWithOAuth({
          provider: "google",
        });
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error("Error logging in with Google:", error.message);
      }
    });

  // Event listener for logout button
  // document.getElementById("logout").addEventListener("click", async () => {
  //   try {
  //     const { error } = await supabaseClient.auth.signOut();
  //     if (error) {
  //       throw error;
  //     }
  //   } catch (error) {
  //     console.error("Error logging out:", error.message);
  //   }
  // });

  // Handling auth state changes
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
      console.log("User signed in:", session.user);
      const todoBox = document.querySelector(".todo-box");
      todoBox.style.display = "block";
      // Update UI for logged-in user
 
    } else if (event === "SIGNED_OUT") {
      console.log("User signed out");
      // Update UI for logged-out user
      document.querySelector(".login-box").classList.add("active");
      document.querySelector(".todo-box").classList.remove("active");
    }
  });
});

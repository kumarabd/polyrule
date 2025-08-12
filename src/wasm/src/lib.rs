use wasm_bindgen::prelude::{wasm_bindgen, JsValue};
use wasm_bindgen_futures::JsFuture;
use web_sys::{Request, RequestInit, RequestMode, Response};
use wasm_bindgen::JsCast;

#[wasm_bindgen]
pub async fn run_inference(user_input: String, api_key: String) -> Result<JsValue, JsValue> {
    let system = "You are a helpful assistant. Answer concisely.";
    let prompt = format!("{} \n\nUser: {}", system, user_input);

    let body = serde_json::json!({
        "model": "gpt-4o-mini",
        "messages": [
            { "role": "system", "content": system },
            { "role": "user", "content": prompt }
        ],
        "temperature": 0.7
    });

    let mut opts = RequestInit::new();
    opts.set_method("POST");
    opts.set_mode(RequestMode::Cors);
    opts.set_body(&JsValue::from_str(&body.to_string()));

    let request = Request::new_with_str_and_init(
        "https://api.openai.com/v1/chat/completions",
        &opts
    )?;
    request.headers().set("Content-Type", "application/json")?;
    let bearer = format!("Bearer {}", api_key);
    request.headers().set("Authorization", &bearer)?;

    let window = web_sys::window().unwrap();
    let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;
    let resp: Response = resp_value.dyn_into().unwrap();
    let json = JsFuture::from(resp.json()?).await?;

    Ok(json)
}

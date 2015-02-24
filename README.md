# cu-25live-mod
This repo contains custom modifications to the 25live UI. 

# How to install
The `cu_mod.css` and `cu_mod.js` files just need to be included somewhere on the page where 25 Live runs. 

# Developer Instructions
Because there is no development environment available for use at this time, the best way to develop these modifications is to use the [chrome extension **Switcheroo**](https://chrome.google.com/webstore/detail/switcheroo-redirector/cnmciclhnghalnpfhhleggldniplelbg?hl=en) to redirect to your local development copies of these assets. 

Then, simply make changes to your local files and reload the staging/production environment in your browser. 

### cu_mod.js

The object `CU_mod` is added to the global scope so it can be accessed by our custom buttons from the DOM. 

Set `CU_mod.debug_mode` to `true` to enable helpful messages in `console.debug`

#### Click Callbacks

Attatch an event to a user click like this:

```js
var my_callback = function() {
  // Your actions here
};

CU_mod.addClickIDCallback('wizard_footer_save', my_callback);

// 'wizard_footer_save' is the ID attribute of an element in the DOM that gets clicked by the user
```

#### DOM insertion callbacks

Attatch an event to a DOM insertion like this:

```js
var my_callback = function() {
  // Your actions here
};

CU_mod.addDOMNodeCallback('s2id_autogen1', my_callback);

// 's2id_autogen1' is the ID attribute of an element that is added to the DOM. 
```

Note that this is only called for the parent node in a set of DOM nodes. In other words, if you are watching for the element `#foo` to be added to the page, your action might be missed if `#foo` is grouped as a child and inserted by 25 live. Use the debug mode messages to identify which parent nodes are inserted. 

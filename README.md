### How to build

```bash
cd /to/this/directory
npm install
npm run build
```
This will result in a folder structure as build output like following :

* [au](./dir2)
    * [Content](./dir2)
        * [html](./dir2)
        * [js](./dir2)
        * [scripts](./dir2)
        * [styles](./dir2)

scripts folder will contains following files:
- more-info-small.js
- more-info-small.map.js
- more-info-large.js
- more-info-large.map.js
- more-info-general.js
- more-info-general.map.js
- top-banner.js
- top-banner.map.js
- price-info.js
- price-info.map.js

### Dependencies
This widget builder uses the following key technologies:
- nodejs
- npm
- webpack
- typescript
- jquery
- jquery-modal

### Usage

In the location you require the banner, use the following markup:

```HTML
<!-- Price Info -->
<script src="price-info.js?productPrice=0"></script>

<!-- More Info Large -->
<script src="more-info-large.js"></script>

<!-- More Info Small -->
<script src="more-info-small.js"></script>

<!-- More Info General -->
<script src="more-info-general.js"></script>

<!-- Top Banner -->
<script src="top-banner.js"></script>
```
The script will bring in all of its CSS and dependencies, and register the button click events
Guide: Installation guide is located at [http://docs.shophumm.com.au/](http://docs.shophumm.com.au/)
Note: All of the views for widgets are located at main Humm Website

#### parameters for the price-info widget
| parameter | meaning  | usage |
|-----------|--------| --- |
| monitor | refresh the price widget every 1 second | &monitor |
| debug | output debug message | \<script src='...' debug\> |
| used_in | | |
| price-selector | select the html element that contains the price | &price-selector=.price_class / &price-selector=%23price_id |
| element | select the html element the widget body inserts to | &element=%23humm_price_widget_target |
| min/max | price < min: show "Pay in slices"; price > max: hide | \<script src='...' data-min='100' data-max='10000'\> |
| BigThings/LittleThings | for merchants who only signed up with BigThings or LittleThings | &BigThings / &LittleThings |


### Local Test:
To switch between local testing and online deployment, you will make changes in /src/au/config.ts:

    change "baseContentUrl"

All .scss files have to be compile into .min.css files.  
This is automatically done when you run **npm run build**.  
Otherwise, you can go to project root folder and use command:
```
sass -s compressed src/au/styles/externalModal.scss:src/au/styles/externalModal.min.css src/au/styles/priceInfoModal.scss:src/au/styles/priceInfoModal.min.css src/au/html/landing-page/styles/landing.scss:src/au/html/landing-page/styles/landing.css 
sass -s compressed css/humm-branding.scss:css/humm-branding.css 

```

## Landing Page
### how to use
1. Create a new page in your online store
2. Paste the following code to the created page:  
```html
<script id="humm-landing-page" src="https://s3-ap-southeast-2.amazonaws.com/widgets.shophumm.com.au/content/scripts/landing-page.js"></script></pre>

```

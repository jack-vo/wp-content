<?php

class GOFI_HelloWorld extends ET_Builder_Module {

	public $slug       = 'gofi_finder';
    public $vb_support = 'on';
    private $finderCategories = [
        [
          'id' => 'music',
          'name' => 'Concerts &amp; Tour Dates'
        ],
        [
            'id' => 'movies_film',
            'name' => 'Film'
        ],
        [
            'id' => 'food',
            'name' => 'Food &amp; Wine'
        ],
        [
          'id' => 'family_fun_kids',
          'name' => 'Kids &amp; Family'
        ],
        [
          'id' => 'festivals_parades',
          'name' => 'Festivals'
        ],
        [
            'id' => 'holiday',
            'name' => 'Holiday'
        ],
        [
            'id' => 'books',
            'name' => 'Literary &amp; Books'
        ],
        [
            'id' => 'comedy',
            'name' => 'Comedy'
        ],
        [
            'id' => 'conference',
            'name' => 'Conferences &amp; Tradeshows'
        ],
        [
            'id' => 'learning_education',
            'name' => 'Education'
        ],
        [
          'id' => 'fundraisers',
          'name' => 'Fundraising &amp; Charity'
        ],
        [
          'id' => 'art',
          'name' => 'Art Galleries &amp; Exhibits'
        ],
        [
          'id' => 'support',
          'name' => 'Health &amp; Wellness'
        ],
        [
          'id' => 'attractions',
          'name' => 'Museums &amp; Attractions'
        ],
        [
          'id' => 'community',
          'name' => 'Neighborhood'
        ],
        [
          'id' => 'business',
          'name' => 'Business &amp; Networking'
        ],
        [
          'id' => 'singles_social',
          'name' => 'Nightlife &amp; Singles'
        ],
        [
          'id' => 'schools_alumni',
          'name' => 'University &amp; Alumni'
        ],
        [
          'id' => 'clubs_associations',
          'name' => 'Organizations &amp; Meetups'
        ],
        [
          'id' => 'outdoors_recreation',
          'name' => 'Outdoors &amp; Recreation'
        ],
        [
          'id' => 'performing_arts',
          'name' => 'Performing Arts'
        ],
        [
          'id' => 'animals',
          'name' => 'Pets'
        ],
        [
          'id' => 'politics_activism',
          'name' => 'Politics &amp; Activism'
        ],
        [
          'id' => 'sales',
          'name' => 'Sales &amp; Retail'
        ],
        [
          'id' => 'science',
          'name' => 'Science'
        ],
        [
          'id' => 'religion_spirituality',
          'name' => 'Religion &amp; Spirituality'
        ],
        [
          'id' => 'sports',
          'name' => 'Sports'
        ],
        [
          'id' => 'technology',
          'name' => 'Technology'
        ],
        [
          'id' => 'other',
          'name' => 'Other &amp; Miscellaneous'
        ]
    ];
    private $finderSortOrder = [
        [
            'id'    => 'popularity',
            'name'  => 'Popularity'
        ],
        [
            'id'    => 'date',
            'name'  => 'Date'
        ]
    ];

	protected $module_credits = array(
		'module_uri' => '',
		'author'     => '',
		'author_uri' => '',
	);

	public function init() {
		$this->name = esc_html__( 'Good times - Finder', 'gofi-goodtimes-finder' );
	}

	public function get_fields() {
		return [
        ];
    }

    private function getCategories() {
        $result = '';
        $selectedCategories = isset($_GET['categories']) ? $_GET['categories'] : [];

        foreach ($this->finderCategories as $category) {
            $result .= '<li><label>';
            $result .= '<input type="checkbox" name="categories[]" value="' . $category['id'] . '" ';

            if (in_array($category['id'], $selectedCategories)) {
                $result .= 'checked="checked" ';
            }

            $result .= '/>';
            $result .= $category['name'];
            $result .= '</label></li>';
        }

        return $result;
    }

    private function getSortOrder() {
        $result = '';

        $selectedSortOrder = isset($_GET['sort_order']) ? $_GET['sort_order'] : 'popularity';

        foreach ($this->finderSortOrder as $order) {
            $result .= '<option';

            if ($selectedSortOrder === $order['id']) {
                $result .= ' selected';
            }

            $result .= ' value="' . $order['id'] . '"';
            $result .= '>';
            $result .= $order['name'];
            $result .= '</option>';
        }

        return $result;
    }

    private function getValue($getKey, $defaultValue = '') {
        return isset($_GET[$getKey]) ? $_GET[$getKey] : $defaultValue;
    }

	public function render( $attrs, $content = null, $render_slug ) {
	    $content = <<<'EOD'
<div class="jv-finder">

<form class="jv-finder-form" data-component="finder-form"
      method="get" action="/yourgoodtimes/good-times-finder/">
    <div class="jv-finder-header">
        <div>
            <h1>Your Good Times Finder!</h1>
            <p>Let’s start searching for the events around you simply by entering your area details and your interested type of events like festival, concert…</p>
        </div>
    </div>
    <div class="jv-finder-form__mainQueryWrapper">
        <div class="et_pb_section et_pb_section_0 et_section_regular">
            <div class="et_pb_column et_pb_column_3_5 et_pb_column_1">
                <label>
                    <span>Location</span>
                    <input class="jv-finder-form__mainQuery" name="location" type="text" maxlength="150" value="%1$s" required/>
                </label>
                <div>
                    <span>Example: <code>London, United Kingdom</code> or <code>Sydney, 2000, Australia</code></span>
                </div>
            </div>
            <div class="et_pb_column et_pb_column_2_5 et_pb_column_2">
                <button class="jv-finder-form__toggleCategories et_pb_button et_pb_custom_button_icon et_pb_button_0 et_pb_bg_layout_light"
                data-icon="3" type="button" data-component="toggle-categories">Select categories</button>
                <div class="jv-finder-categories hidden" data-component="categories">
                    <ul>%2$s</ul>
                    <div class="jv-finder-categories__pointer"></div>
                </div>
                <button class="jv-finder-form__submit et_pb_button et_pb_custom_button_icon et_pb_button_0 et_pb_bg_layout_light"
                data-icon="U" type="submit" title="Start searching">Search</button>
            </div>
        </div>
    </div>
    

    <div class="jv-finder-toggleAdvancedOptionsWrapper">
        <button class="jv-finder-toggleAdvancedOptions et_pb_button et_pb_custom_button_icon et_pb_button_0 et_pb_bg_layout_light" data-icon="3"
        data-component="toggle-advancedOptions" type="button">Advanced search options</button>
    </div>
    
    <div class="jv-finder-advancedOptions invisible" data-component="advancedOptions">
        <div>
            <label>
                <span>Within (miles)</span>
                <input name="within" type="number" value="%3$s" min="1" max="5000"/>
            </label>
        </div>
        <div>
            <label>
                <span>Sort order</span>
                <select name="sort_order">%4$s</select>
            </label>
        </div>
    </div>

    <input type="checkbox" checked="checked" name="get_request" style="display:none !important;"/>
</form>
<div class="jv-finder-events-result" data-component="events-result"></div>
<div class="jv-finder-eventful-promo hidden" data-component="eventful-promo">
    <div class="eventful-badge eventful-small">
        <img src="http://api.eventful.com/images/powered/eventful_58x20.gif" alt="Local Events, Concerts, Tickets">
        <p><a href="http://eventful.com/">Events</a> by Eventful</p>
    </div>
</div>
</div>
EOD;
        $content = sprintf(
            $content,
            $this->getValue('location', ''),
            $this->getCategories(),
            $this->getValue('within', '20'),
            $this->getSortOrder()
        );

        return $content;
	}
}

new GOFI_HelloWorld;

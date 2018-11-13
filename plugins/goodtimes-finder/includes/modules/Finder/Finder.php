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
          'id' => 'conference',
          'name' => 'Conferences &amp; Tradeshows'
        ],
        [
          'id' => 'comedy',
          'name' => 'Comedy'
        ],
        [
          'id' => 'learning_education',
          'name' => 'Education'
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
          'id' => 'movies_film',
          'name' => 'Film'
        ],
        [
          'id' => 'food',
          'name' => 'Food &amp; Wine'
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
          'id' => 'holiday',
          'name' => 'Holiday'
        ],  
        [
          'id' => 'books',
          'name' => 'Literary &amp; Books'
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

    private function getValue($getKey, $defaultValue = '') {
        return isset($_GET[$getKey]) ? $_GET[$getKey] : $defaultValue;
    }

	public function render( $attrs, $content = null, $render_slug ) {
	    $content = <<<'EOD'
<div class="jv-finder">
<h1>Your Good Times Finder!</h1>
<p>Let’s start searching for the events around you simply by entering your area details and your interested type of
events like festival, concert…</p>
<form class="jv-finder-form" data-component="finder-form" method="get" action="/yourgoodtimes/good-times-finder/">
    <div>
        <label>
            <span>Location</span>
            <input name="location" type="text" maxlength="100" value="%1$s"/>
            <span>Example: <code>Lodon, United Kingdom</code> or <code>Sydney, 2000, Australia</code></span>
        </label>
    </div>
    <div>
        <button type="button" data-component="toggle-categories">Select categories</button>
        <ul class="jv-finder-categories" data-component="categories">%2$s</ul>
    </div>
    <label>
        <span>Within (miles)</span>
        <input name="within" type="number" value="%3$s"/>
    </label>
    <input type="checkbox" checked="checked" name="get_request"/>
    <div>
        <button type="submit">Start searching</button>
    </div>

    <div class="eventful-badge eventful-small">
        <img src="http://api.eventful.com/images/powered/eventful_58x20.gif" alt="Local Events, Concerts, Tickets">
        <p><a href="http://eventful.com/">Events</a> by Eventful</p>
    </div>
</form>
<div class="jv-finder-events-result" data-component="events-result"></div>
</div>
EOD;
        $content = sprintf(
            $content,
            $this->getValue('location', ''),
            $this->getCategories(),
            $this->getValue('within', '20')
        );

        return $content;
	}
}

new GOFI_HelloWorld;

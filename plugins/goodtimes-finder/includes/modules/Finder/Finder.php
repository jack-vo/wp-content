<?php

class GOFI_HelloWorld extends ET_Builder_Module {

	public $slug       = 'gofi_finder';
	public $vb_support = 'on';

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
            'content' => [
                'label'           => esc_html__( 'Content', 'gofi-goodtimes-finder' ),
                'type'            => 'tiny_mce',
                'option_category' => 'basic_option',
                'description'     => esc_html__( 'Content entered here will appear inside the module.', 'gofi-goodtimes-finder' ),
                'toggle_slug'     => 'main_content',
            ]
        ];
	}

	public function render( $attrs, $content = null, $render_slug ) {
	    $content = <<<'EOD'
<div class="jv-finder">
<h1>Your Good Times Finder!</h1>
<p>Let’s start searching for the events around you simply by entering your area details and your interested type of
events like festival, concert…</p>
%1$s
<form class="jv-finder-form" data-component="finder-form">
    <div>
        <label>
            <span>Location</span>
            <input name="location" type="text" maxlength="100"/>
            <span>Example: <code>Lodon, United Kingdom</code> or <code>Sydney, 2000, Australia</code></span>
        </label>
    </div>
    <div>
        <button type="button" data-component="toggle-categories">Select categories</button>
        <ul class="jv-finder-categories" data-component="categories">
            <li>
                <label>
                    <input type="checkbox" value="music"/>
                    Concerts &amp; Tour Dates
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="conference"/>
                    Conferences &amp; Tradeshows
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="comedy"/>
                    Comedy
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="learning_education"/>
                    Education
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="family_fun_kids"/>
                    Kids &amp; Family
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="festivals_parades"/>
                    Festivals
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="movies_film"/>
                    Film
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="food"/>
                    Food &amp; Wine
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="fundraisers"/>
                    Fundraising &amp; Charity
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="art"/>
                    Art Galleries &amp; Exhibits
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="support"/>
                    Health &amp; Wellness
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="holiday"/>
                    Holiday
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="books"/>
                    Literary &amp; Books
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="attractions"/>
                    Museums &amp; Attractions
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="community"/>
                    Neighborhood
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="business"/>
                    Business &amp; Networking
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="singles_social"/>
                    Nightlife &amp; Singles
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="schools_alumni"/>
                    University &amp; Alumni
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="clubs_associations"/>
                    Organizations &amp; Meetups
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="outdoors_recreation"/>
                    Outdoors &amp; Recreation
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="performing_arts"/>
                    Performing Arts
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="animals"/>
                    Pets
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="politics_activism"/>
                    Politics &amp; Activism
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="sales"/>
                    Sales &amp; Retail
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="science"/>
                    Science
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="religion_spirituality"/>
                    Religion &amp; Spirituality
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="sports"/>
                    Sports
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="technology"/>
                    Technology
                </label>
            </li>
            
            <li>
                <label>
                    <input type="checkbox" value="other"/>
                    Other &amp; Miscellaneous
                </label>
            </li>
        </ul>
    </div>
    <label>
        <span>Within (miles)</span>
        <input name="within" type="number" value="20"/>
    </label>
    <label>
        <span>Sort order</span>
        <select name="sort_order" type="number">
            <option value="popularity" selected>Popularity</option>        
            <option value="date">Date</option>        
            <option value="relevance">Relevance</option>        
        </select>
    </label>
    <div>
        <button type="submit">Start searching</button>
    </div>
</form>
<div class="jv-finder-events-result" data-component="events-result"></div>
</div>
EOD;

		return sprintf($content, $this->props['content']);
	}
}

new GOFI_HelloWorld;

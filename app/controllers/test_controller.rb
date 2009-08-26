require 'rfacebook'

class TestController < ApplicationController
  def test
    if fbsession.ready?
      @test = "im here!"
    else 
      @test = "no!"
    end
  end

end
